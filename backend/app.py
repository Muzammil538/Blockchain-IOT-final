from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
import cloudinary
import cloudinary.uploader
from blockchain import Blockchain
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"], allow_headers=["Content-Type", "Authorization"])

# Initialize Blockchain
blockchain = Blockchain()

# Firebase Configuration
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Helper Functions
def verify_firebase_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print("Token verification failed:", e)
        return None
    
    
# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    # Implementation for user registration
    pass

@app.route('/api/login', methods=['POST'])
def login():
    # Implementation for user login
    pass

@app.route('/api/blockchain', methods=['GET', 'POST'])
def get_chain():
    # Convert each block to a dictionary
    chain_data = [block.to_dict() for block in blockchain.chain]
    return jsonify({
        "chain": chain_data,
        "length": len(chain_data)
    }), 200

@app.route('/api/users/<uid>/uploads', methods=['GET'])
def get_current_user_uploads(uid):
    # Optionally, verify the user's token here for security
    user_ref = db.collection('users').document(uid)
    uploads_ref = user_ref.collection('uploads')
    uploads = [doc.to_dict() for doc in uploads_ref.stream()]
    return jsonify(uploads), 200


@app.route('/api/upload', methods=['POST'])
def upload_data():
    auth_header = request.headers.get('Authorization')
    print('Authorization header:', auth_header)  # Debug
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    id_token = auth_header.split('Bearer ')[1]
    decoded_token = verify_firebase_token(id_token)
    print('Decoded token:', decoded_token)  # Debug
    if not decoded_token:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    
    # Get uploaded file
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    # Upload to Cloudinary
    upload_result = cloudinary.uploader.upload(file, resource_type="auto")
    
    # Create blockchain record
    data_hash = upload_result['public_id']
    metadata = {
        "user_id": decoded_token['uid'],
        "timestamp": upload_result['created_at'],
        "data_hash": data_hash,
        "url": upload_result['secure_url'],
        "format": upload_result.get('format', upload_result.get('resource_type', 'unknown')),
        "size": upload_result['bytes']
    }
    
    # Add to blockchain
    block_hash = blockchain.add_block(metadata)
    
    # Store metadata in Firestore
    user_ref = db.collection('users').document(decoded_token['uid'])
    user_ref.collection('uploads').document(data_hash).set({
        "block_hash": block_hash,
        **metadata
    })
    
    return jsonify({
        "message": "File uploaded successfully",
        "data_hash": data_hash,
        "block_hash": block_hash
    })

@app.route('/api/verify', methods=['GET'])
def verify_data():
    data_hash = request.args.get('hash')
    if not data_hash:
        return jsonify({"error": "No hash provided"}), 400
    
    # Find block in blockchain
    block = blockchain.find_block_by_data_hash(data_hash)
    if not block:
        return jsonify({"error": "Data not found in blockchain"}), 404
    
    # Get metadata from Firestore
    docs = db.collection_group('uploads').where('data_hash', '==', data_hash).get()
    if not docs:
        return jsonify({"error": "Metadata not found"}), 404
    
    metadata = docs[0].to_dict()
    
    return jsonify({
        "verified": True,
        "block": {
            "index": block.index,
            "timestamp": block.timestamp,
            "hash": block.hash
        },
        "metadata": metadata
    })

@app.route('/api/user/uploads', methods=['GET'])
def get_user_uploads():
    # Verify user token
    id_token = request.headers.get('Authorization')
    decoded_token = verify_firebase_token(id_token)
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    # Get user uploads
    uploads_ref = db.collection('users').document(decoded_token['uid']).collection('uploads')
    uploads = [doc.to_dict() for doc in uploads_ref.get()]
    
    return jsonify(uploads)

@app.route('/api/admin/uploads', methods=['GET'])
def get_all_uploads():
    # Verify admin token
    id_token = request.headers.get('Authorization')
    decoded_token = verify_firebase_token(id_token)
    if not decoded_token or not decoded_token.get('admin', False):
        return jsonify({"error": "Unauthorized"}), 401
    
    # Get all uploads
    uploads = []
    users_ref = db.collection('users')
    for user in users_ref.get():
        user_uploads = user.reference.collection('uploads').get()
        for upload in user_uploads:
            upload_data = upload.to_dict()
            upload_data['user_id'] = user.id
            uploads.append(upload_data)
    
    return jsonify(uploads)

if __name__ == '__main__':
    app.run(debug=True)
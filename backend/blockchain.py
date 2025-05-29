import hashlib
import time
import json
from datetime import datetime

class Block:
    def __init__(self, index, previous_hash, data, timestamp=None):
        self.index = index
        self.previous_hash = previous_hash
        self.data = data
        self.timestamp = timestamp or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.hash = self.calculate_hash()
        
    def calculate_hash(self):
        block_string = f"{self.index}{self.previous_hash}{self.timestamp}{json.dumps(self.data)}"
        return hashlib.sha256(block_string.encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        
    def create_genesis_block(self):
        return Block(0, "0", {"message": "Genesis Block"})
    
    def get_latest_block(self):
        return self.chain[-1]
    
    def add_block(self, new_data):
        previous_block = self.get_latest_block()
        new_block = Block(
            index=previous_block.index + 1,
            previous_hash=previous_block.hash,
            data=new_data
        )
        self.chain.append(new_block)
        return new_block.hash
    
    def validate_chain(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]
            
            if current_block.hash != current_block.calculate_hash():
                return False
            if current_block.previous_hash != previous_block.hash:
                return False
        return True
    
    def find_block_by_data_hash(self, data_hash):
        for block in self.chain:
            if 'data_hash' in block.data and block.data['data_hash'] == data_hash:
                return block
        return None
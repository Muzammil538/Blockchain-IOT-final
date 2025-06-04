import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUpload } from '../../hooks/useUpload';
import { useBlockchain } from '../../hooks/useBlockchain';
import { formatTimestamp } from '../../utils/helpers';

export default function Verify() {
  const { currentUser } = useAuth();
  const { verify, isLoading, error } = useUpload();
  const { getBlockByHash } = useBlockchain();
  const [dataHash, setDataHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dataHash || !currentUser) return;
    
    try {
      const token = await currentUser.getIdToken();
      const result = await verify(dataHash, token);
      setVerificationResult({
        ...result,
        block: getBlockByHash(result.block.hash)
      });
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Verify Data Integrity</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dataHash" className="block text-sm font-medium text-gray-700">
              Data Hash
            </label>
            <input
              type="text"
              id="dataHash"
              name="dataHash"
              value={dataHash}
              onChange={(e) => setDataHash(e.target.value)}
              placeholder="Enter the hash of your data"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!dataHash || isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Data'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Verification Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {verificationResult && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-md ${
              verificationResult.verified 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {verificationResult.verified ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    verificationResult.verified ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {verificationResult.verified 
                      ? 'Data integrity verified' 
                      : 'Data verification failed'}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Blockchain Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Block Index:</div>
                <div>{verificationResult.block.index}</div>
                
                <div className="text-gray-600">Timestamp:</div>
                <div>{formatTimestamp(verificationResult.block.timestamp)}</div>
                
                <div className="text-gray-600">Block Hash:</div>
                <div className="font-mono text-xs break-all">
                  {verificationResult.block.hash}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Metadata</h4>
              <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                {JSON.stringify(verificationResult.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
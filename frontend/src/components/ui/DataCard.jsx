import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { formatTimestamp, formatFileSize } from '../../utils/helpers';

export default function DataCard({ data, onVerify }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {data.fileName || 'Untitled'}
          </h3>
          <div className="mt-1 text-sm text-gray-500 space-y-1">
            <p>Type: {data.format}</p>
            <p>Size: {formatFileSize(data.size)}</p>
            <p>Uploaded: {formatTimestamp(data.timestamp)}</p>
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              data.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {data.verified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </div>
      {onVerify && !data.verified && (
        <div className="mt-4">
          <button
            onClick={() => onVerify(data.data_hash)}
            className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Verify on Blockchain
          </button>
        </div>
      )}
    </div>
  );
}
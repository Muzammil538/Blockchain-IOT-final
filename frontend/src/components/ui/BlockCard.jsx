import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { formatTimestamp, truncateString } from '../../utils/helpers';

export default function BlockCard({ block, onClick }) {
  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">Block #{block.index}</h3>
          <p className="text-sm text-gray-500">
            {formatTimestamp(block.timestamp)}
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {block.data?.data_hash ? 'Data' : 'System'}
        </span>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm">
          <span className="font-medium">Hash:</span>{' '}
          <span className="font-mono">{truncateString(block.hash, 12)}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium">Previous:</span>{' '}
          <span className="font-mono">{truncateString(block.previous_hash, 12)}</span>
        </p>
      </div>
      <div className="mt-3 flex justify-end">
        <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          Details <ArrowRightIcon className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
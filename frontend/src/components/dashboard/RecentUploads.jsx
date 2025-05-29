import { formatTimestamp, formatFileSize } from '../../utils/helpers';

export default function RecentUploads({ uploads }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {uploads.map((upload, index) => (
          <li key={index}>
            <div className="relative pb-8">
              {index !== uploads.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <span className="text-white text-sm">📄</span>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{upload.fileName}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {upload.format} • {formatFileSize(upload.size)}
                      </span>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={upload.timestamp}>
                      {formatTimestamp(upload.timestamp)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
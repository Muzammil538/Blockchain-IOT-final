import { ClockIcon, CloudArrowUpIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { formatTimestamp, formatFileSize } from '../../utils/helpers';


export default function RecentActivity({ 
  title, 
  items, 
  emptyMessage = "No recent activity",
  type = 'uploads' // 'uploads' or 'users'
}) {
  // Activity type configuration
  const activityConfig = {
    uploads: {
      icon: CloudArrowUpIcon,
      iconColor: 'text-blue-500 bg-blue-50',
      fields: [
        { label: 'File', key: 'fileName' },
        { label: 'Size', key: 'size', formatter: formatFileSize },
        { label: 'Type', key: 'format' }
      ]
    },
    users: {
      icon: UserPlusIcon,
      iconColor: 'text-green-500 bg-green-50',
      fields: [
        { label: 'Email', key: 'email' },
        { label: 'Name', key: 'displayName', fallback: 'N/A' },
        { label: 'Role', key: 'role', fallback: 'user' }
      ]
    }
  };

  const config = activityConfig[type];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {items.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {items.length} {type}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.slice(0, 5).map((item, index) => (
              <li key={index} className="py-4">
                <div className="flex space-x-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${config.iconColor}`}>
                    <config.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {type === 'uploads' ? item.fileName || 'Untitled' : item.email}
                      </p>
                      <div className="flex text-sm text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1 h-4 w-4" />
                        <span>
                          {formatTimestamp(
                            type === 'uploads' ? item.timestamp : item.metadata?.creationTime
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 grid grid-cols-3 gap-2 text-sm text-gray-500">
                      {config.fields.map((field, i) => (
                        <div key={i}>
                          <span className="font-medium text-gray-700">{field.label}: </span>
                          <span>
                            {field.formatter 
                              ? field.formatter(item[field.key])
                              : item[field.key] || field.fallback || 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                    {type === 'uploads' && item.userEmail && (
                      <p className="mt-1 text-xs text-gray-500">
                        Uploaded by: {item.userEmail}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 5 && (
          <div className="mt-4 text-right">
            <a
              href={type === 'uploads' ? '/admin/uploads' : '/admin/users'}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
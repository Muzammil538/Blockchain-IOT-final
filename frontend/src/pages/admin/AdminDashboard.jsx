import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { adminGetAllUploads, adminGetAllUsers } from '../../../services/api';
import StatsCard from '../../../components/admin/StatsCard';
import RecentActivity from '../../../components/admin/RecentActivity';
import DataChart from '../../../components/admin/DataChart';
import { formatFileSize } from '../../../utils/helpers';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUploads: 0,
    storageUsed: 0,
    blockchainSize: 0
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data for the chart (you would replace with real data)
  const chartData = [
    { date: 'Jan', count: 12 },
    { date: 'Feb', count: 19 },
    { date: 'Mar', count: 8 },
    { date: 'Apr', count: 15 },
    { date: 'May', count: 22 },
    { date: 'Jun', count: 18 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await currentUser.getIdToken();
        const [uploads, users] = await Promise.all([
          adminGetAllUploads(token),
          adminGetAllUsers(token)
        ]);

        setStats({
          totalUsers: users.length,
          totalUploads: uploads.length,
          storageUsed: uploads.reduce((sum, upload) => sum + (upload.fileSize || 0), 0),
          blockchainSize: uploads.length * 256 // Simplified estimation
        });

        setRecentUploads(uploads.slice(0, 5));
        setRecentUsers(users.slice(0, 5));
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md max-w-md mx-auto mt-8">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of system activity and statistics
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon="👥"
          trend="up"
          change="12%"
          color="blue"
        />
        <StatsCard 
          title="Data Uploads" 
          value={stats.totalUploads} 
          icon="📊"
          trend="up"
          change="8%"
          color="green"
        />
        <StatsCard 
          title="Storage Used" 
          value={formatFileSize(stats.storageUsed)} 
          icon="💾"
          trend="up"
          change="24%"
          color="purple"
        />
        <StatsCard 
          title="Blockchain Size" 
          value={formatFileSize(stats.blockchainSize)} 
          icon="⛓️"
          trend="up"
          change="18%"
          color="indigo"
        />
      </div>

      {/* Chart Section */}
      <div className="mb-8">
        <DataChart data={chartData} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Uploads"
          items={recentUploads.map(upload => ({
            id: upload.id,
            title: upload.fileName || 'Untitled',
            description: `Uploaded by ${upload.userEmail}`,
            timestamp: upload.timestamp,
            icon: '📤',
            size: formatFileSize(upload.fileSize),
            type: upload.format
          }))}
          emptyMessage="No recent uploads"
          viewAllLink="/admin/uploads"
        />
        <RecentActivity
          title="New Users"
          items={recentUsers.map(user => ({
            id: user.uid,
            title: user.email,
            description: user.displayName || 'No name provided',
            timestamp: user.metadata.creationTime,
            icon: '👤',
            role: user.role || 'user'
          }))}
          emptyMessage="No new users"
          viewAllLink="/admin/users"
        />
      </div>
    </div>
  );
}
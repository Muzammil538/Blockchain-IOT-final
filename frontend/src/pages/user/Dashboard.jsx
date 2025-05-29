import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getUserUploads } from '../../../services/api';
import { formatFileSize } from '../../../utils/helpers';
import StatsCard from '../../../components/dashboard/StatsCard';
import RecentUploads from '../../../components/dashboard/RecentUploads';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUploads: 0,
    storageUsed: 0,
    verifiedCount: 0
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uploads = await getUserUploads(
          currentUser.uid,
          await currentUser.getIdToken()
        );

        setStats({
          totalUploads: uploads.length,
          storageUsed: uploads.reduce((sum, upload) => sum + (upload.size || 0), 0),
          verifiedCount: uploads.filter(u => u.verified).length
        });

        setRecentUploads(uploads.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Uploads" 
          value={stats.totalUploads} 
          icon="📤"
          color="blue"
        />
        <StatsCard 
          title="Storage Used" 
          value={formatFileSize(stats.storageUsed)} 
          icon="💾"
          color="green"
        />
        <StatsCard 
          title="Verified Files" 
          value={stats.verifiedCount} 
          icon="✅"
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
        <RecentUploads uploads={recentUploads} />
        
        {recentUploads.length === 0 && (
          <p className="text-gray-500 text-center py-4">No recent uploads found</p>
        )}

        <div className="mt-4 text-right">
          <a 
            href="/history" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all uploads →
          </a>
        </div>
      </div>
    </div>
  );
}
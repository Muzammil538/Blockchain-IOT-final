import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { adminGetAllUploads } from '../../../services/api';
import { formatTimestamp, formatFileSize } from '../../../utils/helpers';
import { usePagination } from '../../../hooks/usePagination';
import DataTable from '../../../components/admin/DataTable';

export default function AllUploads() {
  const { currentUser } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {
    currentPage,
    paginatedData,
    totalPages,
    goToPage,
    itemsPerPage
  } = usePagination(uploads, 10);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const data = await adminGetAllUploads(await currentUser.getIdToken());
        setUploads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUploads();
    }
  }, [currentUser]);

  const columns = [
    { header: 'User', accessor: 'userEmail' },
    { header: 'File Name', accessor: 'fileName' },
    { header: 'Type', accessor: 'fileType' },
    { 
      header: 'Size', 
      accessor: 'fileSize',
      render: (value) => formatFileSize(value)
    },
    { 
      header: 'Uploaded', 
      accessor: 'timestamp',
      render: (value) => formatTimestamp(value)
    },
    { header: 'Status', accessor: 'status' },
    { header: 'Block Hash', accessor: 'blockHash', truncate: true }
  ];

  if (loading) return <div className="text-center py-8">Loading uploads...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">All Data Uploads</h2>
        
        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
          emptyMessage="No uploads found"
        />
      </div>
    </div>
  );
}
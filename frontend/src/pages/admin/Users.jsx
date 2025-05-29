import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { adminGetAllUsers, adminUpdateUser } from '../../../services/api';
import { formatTimestamp } from '../../../utils/helpers';
import { usePagination } from '../../../hooks/usePagination';
import DataTable from '../../../components/admin/DataTable';

export default function Users() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    currentPage,
    paginatedData,
    totalPages,
    goToPage,
    itemsPerPage
  } = usePagination(users, 10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminGetAllUsers(await currentUser.getIdToken());
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminUpdateUser(
        userId, 
        { role: newRole },
        await currentUser.getIdToken()
      );
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError(`Failed to update user: ${err.message}`);
    }
  };

  const columns = [
    { header: 'Email', accessor: 'email' },
    { header: 'Name', accessor: 'name' },
    { 
      header: 'Joined', 
      accessor: 'createdAt',
      render: (value) => formatTimestamp(value)
    },
    { 
      header: 'Role', 
      accessor: 'role',
      render: (value, row) => (
        <select
          value={value}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )
    },
    { header: 'Last Login', accessor: 'lastLoginAt' }
  ];

  if (loading) return <div className="text-center py-8">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">User Management</h2>
        
        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
          emptyMessage="No users found"
        />
      </div>
    </div>
  );
}
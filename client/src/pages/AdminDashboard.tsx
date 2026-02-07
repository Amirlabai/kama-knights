import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const approveUser = async (userId: string) => {
        try {
            await api.post('/auth/approve', { userId });
            fetchUsers(); // Refresh
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <nav className="bg-white shadow p-4 flex justify-between">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="text-red-500">Logout</button>
            </nav>

            <main className="p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">User Management</h2>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-4">Phone</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Role</th>
                                <th className="text-left p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-4">{u.phoneNumber}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${u.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {u.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 uppercase text-xs">{u.role}</td>
                                    <td className="p-4">
                                        {!u.isApproved && (
                                            <button
                                                onClick={() => approveUser(u._id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await login(phone);
            if (res.status === 'pending') {
                setStatus('success');
                setMsg('Account pending approval. Please contact admin.');
            } else {
                // Active
                navigate('/');
            }
        } catch (err: any) {
            setStatus('error');
            setMsg(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">Personal Notifier</h1>

                {status === 'success' ? (
                    <div className="text-center p-4 bg-yellow-900/50 text-yellow-200 rounded mb-4 border border-yellow-700">
                        {msg}
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1234567890"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-500"
                                required
                            />
                        </div>

                        {status === 'error' && (
                            <div className="text-red-400 text-sm text-center">{msg}</div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Verifying...' : 'Enter App'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;

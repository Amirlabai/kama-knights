import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';
import MapComponent from '../components/MapComponent';
import api from '../utils/api';

const UserApp = () => {
    const { user, logout } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [networkType, setNetworkType] = useState<'wifi' | 'mobile'>('mobile'); // Simulation
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        // 1. Connect Socket
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket');
            if (location) {
                newSocket.emit('join', { userId: user?._id, location, networkType });
            }
        });

        newSocket.on('alert', (alert) => {
            console.log('RECEIVED ALERT:', alert);
            setAlerts(prev => [alert, ...prev]);
            // Trigger vibration or sound here
            if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
        });

        return () => { newSocket.disconnect(); };
    }, [user]);

    // 2. Track Location
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setLocation(newLoc);

                if (socket) {
                    socket.emit('updateLocation', { location: newLoc, networkType });
                }
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [socket, networkType]);


    const sendAlert = async (useLocation: boolean, pinLocation?: { lat: number, lng: number }) => {
        if (!location) return;

        const targetLoc = useLocation ? location : pinLocation;

        try {
            await api.post('/alerts/send', {
                senderId: user?._id,
                location: targetLoc,
                message: "EMERGENCY: Need assistance!"
            });
            alert('Alert Sent!');
        } catch (err) {
            console.error(err);
            alert('Failed to send alert');
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gray-900 text-white">
            {/* Top Bar */}
            <div className="p-4 bg-gray-800 flex justify-between items-center shadow-md z-10">
                <div>
                    <h1 className="font-bold text-lg">Notifier</h1>
                    <div className="text-xs text-gray-400">
                        Net: <span className={networkType === 'mobile' ? 'text-green-400' : 'text-yellow-400'}>{networkType.toUpperCase()}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setNetworkType(prev => prev === 'mobile' ? 'wifi' : 'mobile')} className="text-xs px-2 py-1 bg-gray-700 rounded border border-gray-600">
                        Toggle Net
                    </button>
                    <button onClick={logout} className="text-xs px-2 py-1 bg-red-900/50 text-red-200 rounded border border-red-800">
                        Logout
                    </button>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                {location ? (
                    <MapComponent
                        location={location}
                        alerts={alerts}
                        onSendAlert={(pin) => sendAlert(false, pin)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Waiting for GPS...
                    </div>
                )}

                {/* Floating Action Button for Instant Alert */}
                <button
                    onClick={() => sendAlert(true)}
                    className="absolute bottom-6 right-6 w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl flex items-center justify-center z-[1000] border-4 border-gray-900 active:scale-95 transition-transform"
                >
                    <span className="font-bold text-xs">SOS</span>
                </button>
            </div>
        </div>
    );
};

export default UserApp;

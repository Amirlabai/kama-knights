import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    location: { lat: number; lng: number };
    alerts: any[];
    onSendAlert: (pin: { lat: number; lng: number }) => void;
}

const LocationMarker = ({ position }: { position: { lat: number, lng: number } }) => {
    useMapEvents({
        click() {
            // Optional: click to center?
        },
    });

    // Auto-center on startup or significant move? 
    // Usually annoying if user is panning. Let's just show marker.

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

const MapComponent = ({ location, alerts, onSendAlert }: MapProps) => {

    const MapEvents = () => {
        useMapEvents({
            contextmenu: (e) => {
                // Right click (or long press on mobile) to drop pin for alert
                if (confirm('Send alert from this location?')) {
                    onSendAlert(e.latlng);
                }
            }
        });
        return null;
    }

    return (
        <MapContainer center={location} zoom={15} scrollWheelZoom={true} className="h-full w-full z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker position={location} />

            {alerts.map((alert, idx) => (
                <Marker key={idx} position={[alert.location.coordinates[1], alert.location.coordinates[0]]}>
                    <Popup>
                        <strong>ALERT!</strong><br />
                        {alert.message}<br />
                        From: {alert.senderPhone}
                    </Popup>
                </Marker>
            ))}

            <MapEvents />
        </MapContainer>
    );
};

export default MapComponent;

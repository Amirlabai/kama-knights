import { isPointInRegion } from './services/geofenceService';
import { IRegion } from './models/Region';

// MOCK DATA
const mockRegion: IRegion = {
    name: 'Test Region',
    polygon: {
        type: 'Polygon',
        coordinates: [[
            [0, 0], [0, 10], [10, 10], [10, 0], [0, 0] // 0-10 box
        ]]
    },
    isActive: true
} as any;

const users = [
    { id: 'user1-mobile-in', location: { lat: 5, lng: 5 }, networkType: 'mobile' }, // High Priority
    { id: 'user2-wifi-in', location: { lat: 5, lng: 5 }, networkType: 'wifi' },   // Low Priority
    { id: 'user3-mobile-out', location: { lat: 20, lng: 20 }, networkType: 'mobile' }, // Excluded
    { id: 'user4-wifi-in', location: { lat: 2, lng: 2 }, networkType: 'wifi' },   // Low Priority
];

console.log('--- STARTING VERIFICATION ---');

// 1. GEOFENCE TEST
console.log('\n1. Geofence Test:');
users.forEach(u => {
    const inside = isPointInRegion(u.location, mockRegion);
    console.log(`User ${u.id}: ${inside ? 'INSIDE' : 'OUTSIDE'} (Expected: ${u.id.includes('out') ? 'OUTSIDE' : 'INSIDE'})`);
});

// 2. PRIORITY TEST
console.log('\n2. Priority Test:');
const inRegionUsers = users.filter(u => isPointInRegion(u.location, mockRegion));
inRegionUsers.sort((a, b) => {
    if (a.networkType === 'mobile' && b.networkType !== 'mobile') return -1;
    if (a.networkType !== 'mobile' && b.networkType === 'mobile') return 1;
    return 0;
});

console.log('Prioritized List (Should be Mobile first):');
inRegionUsers.forEach((u, idx) => {
    console.log(`${idx + 1}. ${u.id} (${u.networkType})`);
});

if (inRegionUsers[0].networkType === 'mobile') {
    console.log('\nSUCCESS: Mobile user prioritized.');
} else {
    console.error('\nFAIL: WiFi user prioritized or sorting failed.');
}

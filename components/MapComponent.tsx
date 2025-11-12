import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Startup } from '../types';

interface MapComponentProps {
  startups: Startup[];
}

export const MapComponent: React.FC<MapComponentProps> = ({ startups }) => {
  const defaultPosition: [number, number] = [27.1783, 31.1859]; // Asyut, Egypt

  return (
    <MapContainer center={defaultPosition} zoom={8} scrollWheelZoom={true} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {startups.map(startup => (
        <Marker key={startup.id} position={[startup.lat, startup.lng]}>
          <Popup>
            <div className="p-1 font-sans max-w-sm">
              <h3 className="font-bold text-lg text-indigo-600 mb-1">{startup.name}</h3>
              <p className="text-gray-600 mt-2 text-sm italic mb-2">{startup.description}</p>
              <div className="text-gray-700 text-sm space-y-1">
                 <p><span className="font-semibold">Sector:</span> {startup.sector}</p>
                 <p><span className="font-semibold">Stage:</span> {startup.stage}</p>
                 <p><span className="font-semibold">Location:</span> {startup.center}, {startup.location}</p>
                 <p><span className="font-semibold">Company Type:</span> {startup.companyType}</p>
                 <p><span className="font-semibold">Employees:</span> {startup.employees}</p>
                 <p><span className="font-semibold">Annual Revenue:</span> {startup.annualRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 })}</p>
                 <p><span className="font-semibold">Founders:</span> {startup.foundersGender} ({startup.femaleFounders} female / {startup.foundingTeamSize} total)</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

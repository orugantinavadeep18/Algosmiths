import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { MapPin, Briefcase, User, Star, Phone, Mail } from 'lucide-react';
import { userAPI, taskAPI } from '../services/api';

const MapView = ({ viewType = 'both', userLocation = null }) => {
  const [map, setMap] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(5); // in km
  const [userLocationData, setUserLocationData] = useState(userLocation || null);

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '16px'
  };

  const center = userLocationData || { lat: 17.3850, lng: 78.4867 }; // Default to Hyderabad

  // Get user's current location
  useEffect(() => {
    if (!userLocationData && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocationData({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Location access denied, using default location');
        }
      );
    }
  }, [userLocationData]);

  // Fetch nearby workers
  useEffect(() => {
    if (userLocationData && (viewType === 'workers' || viewType === 'both')) {
      fetchNearbyWorkers();
    }
  }, [userLocationData, radius, viewType]);

  // Fetch nearby tasks
  useEffect(() => {
    if (userLocationData && (viewType === 'tasks' || viewType === 'both')) {
      fetchNearbyTasks();
    }
  }, [userLocationData, radius, viewType]);

  const fetchNearbyWorkers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getNearbyWorkers({
        latitude: userLocationData.lat,
        longitude: userLocationData.lng,
        radius
      });
      setWorkers(response.workers || []);
    } catch (err) {
      console.error('Error fetching nearby workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getNearbyTasks({
        latitude: userLocationData.lat,
        longitude: userLocationData.lng,
        radius
      });
      setTasks(response.tasks || []);
    } catch (err) {
      console.error('Error fetching nearby tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">
            Radius: {radius} km
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-xs text-gray-600">
          {workers.length} workers • {tasks.length} tasks
        </div>
      </div>

      {/* Map */}
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={handleMapLoad}
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#616161' }]
              }
            ]
          }}
        >
          {/* User Location Marker */}
          {userLocationData && (
            <MarkerF
              position={userLocationData}
              title="Your Location"
              icon={{
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
                fillColor: '#4F46E5',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 1.5
              }}
              onClick={() => setSelectedMarker({ type: 'user', data: { lat: userLocationData.lat, lng: userLocationData.lng } })}
            />
          )}

          {/* Worker Markers */}
          {workers.map((worker) => (
            <MarkerF
              key={worker._id}
              position={{
                lat: worker.location?.coordinates[1],
                lng: worker.location?.coordinates[0]
              }}
              title={worker.fullName}
              icon={{
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
                fillColor: '#06B6D4',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 1.5
              }}
              onClick={() => setSelectedMarker({ type: 'worker', data: worker })}
            />
          ))}

          {/* Task Markers */}
          {tasks.map((task) => (
            <MarkerF
              key={task._id}
              position={{
                lat: task.location?.coordinates[1],
                lng: task.location?.coordinates[0]
              }}
              title={task.taskDescription}
              icon={{
                path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
                fillColor: '#EC4899',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 1.5
              }}
              onClick={() => setSelectedMarker({ type: 'task', data: task })}
            />
          ))}

          {/* Info Windows */}
          {selectedMarker && selectedMarker.type === 'worker' && selectedMarker.data && (
            <InfoWindowF
              position={{
                lat: selectedMarker.data.location?.coordinates[1],
                lng: selectedMarker.data.location?.coordinates[0]
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="bg-white rounded-lg p-3 max-w-xs">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {selectedMarker.data.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{selectedMarker.data.fullName}</h3>
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <Star className="w-3 h-3 fill-yellow-600" />
                      {selectedMarker.data.rating || 'No rating'} • {selectedMarker.data.completedTasks || 0} tasks
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {calculateDistance(userLocationData.lat, userLocationData.lng, selectedMarker.data.location?.coordinates[1], selectedMarker.data.location?.coordinates[0])} km away
                </p>
                <button className="w-full bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-blue-700 transition-all">
                  View Profile
                </button>
              </div>
            </InfoWindowF>
          )}

          {selectedMarker && selectedMarker.type === 'task' && selectedMarker.data && (
            <InfoWindowF
              position={{
                lat: selectedMarker.data.location?.coordinates[1],
                lng: selectedMarker.data.location?.coordinates[0]
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="bg-white rounded-lg p-3 max-w-xs">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{selectedMarker.data.taskDescription}</h3>
                <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {calculateDistance(userLocationData.lat, userLocationData.lng, selectedMarker.data.location?.coordinates[1], selectedMarker.data.location?.coordinates[0])} km away
                </p>
                <div className="text-xs text-gray-700 mb-2 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Budget: ₹{selectedMarker.data.budget}
                </div>
                <button className="w-full bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-blue-700 transition-all">
                  Apply Now
                </button>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
            <h4 className="font-semibold text-gray-900 text-sm">Active Workers</h4>
          </div>
          <p className="text-xs text-gray-600">Skilled professionals ready to work</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-pink-500"></div>
            <h4 className="font-semibold text-gray-900 text-sm">Available Tasks</h4>
          </div>
          <p className="text-xs text-gray-600">Tasks available in your area</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
            <h4 className="font-semibold text-gray-900 text-sm">Your Location</h4>
          </div>
          <p className="text-xs text-gray-600">Your current position</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Users, Briefcase, Navigation } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { userAPI, taskAPI } from '../services/api';

const MapViewMapbox = ({ viewType = 'all' }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(5); // km
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState(true);
  const watchIdRef = useRef(null);
  const markersRef = useRef([]);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Initialize Mapbox
  useEffect(() => {
    if (!mapboxToken) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Get initial location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          userAPI.updateUserLocation({
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
          }).catch(err => console.log('Location saved'));
        },
        (error) => {
          console.log('Using default location - Hyderabad');
          setUserLocation({
            latitude: 17.3850,
            longitude: 78.4867,
          });
        }
      );
    }
  }, [mapboxToken]);

  // Initialize and update map
  useEffect(() => {
    if (!userLocation || !mapContainer.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 12,
      });

      // Add controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showAccuracyCircle: true,
        }),
        'top-right'
      );
    } else {
      // Update map center
      map.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 12,
      });
    }
  }, [userLocation]);

  // Fetch nearby data
  useEffect(() => {
    if (!userLocation) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (viewType === 'all' || viewType === 'workers') {
          try {
            // Get active users only
            const workersData = await userAPI.getNearbyWorkers({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              maxDistance: radius * 1000, // Convert km to meters
            });
            console.log('Nearby workers response:', workersData);
            setWorkers(workersData.data || []);
          } catch (err) {
            console.error('Error fetching workers:', err);
            setWorkers([]);
          }
        }

        if (viewType === 'all' || viewType === 'tasks') {
          try {
            const tasksData = await taskAPI.getNearbyTasks({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              maxDistance: radius * 1000,
            });
            console.log('Nearby tasks response:', tasksData);
            setTasks(tasksData.data || []);
          } catch (err) {
            console.error('Error fetching tasks:', err);
            setTasks([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [userLocation, radius, viewType]);

  // Update markers on map
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userMarkerDiv = document.createElement('div');
      userMarkerDiv.className = 'relative w-6 h-6';
      userMarkerDiv.innerHTML = `
        <div class="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-75"></div>
        <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      `;

      const userMarker = new mapboxgl.Marker(userMarkerDiv)
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
      
      markersRef.current.push(userMarker);
    }

    // Add worker markers
    if (viewType === 'all' || viewType === 'workers') {
      workers.forEach((worker) => {
        const workerMarkerDiv = document.createElement('div');
        workerMarkerDiv.className = 'w-8 h-8 bg-cyan-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:w-10 hover:h-10 transition-all';
        workerMarkerDiv.innerHTML = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 00-6-6 6 6 0 00-6 6z"></path></svg>`;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3 bg-white rounded-lg shadow-lg max-w-xs">
            <h3 class="font-bold text-gray-800">${worker.name}</h3>
            <p class="text-sm text-gray-600">${worker.title || 'Worker'}</p>
            <div class="mt-2 text-xs text-gray-600">
              <p>⭐ ${worker.averageRating?.toFixed(1) || 'N/A'}</p>
              <p>💰 $${worker.hourlyRate || 'N/A'}/hr</p>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(workerMarkerDiv)
          .setLngLat([worker.location.coordinates[0], worker.location.coordinates[1]])
          .setPopup(popup)
          .addTo(map.current);

        workerMarkerDiv.addEventListener('click', () => {
          marker.togglePopup();
        });

        markersRef.current.push(marker);
      });
    }

    // Add task markers
    if (viewType === 'all' || viewType === 'tasks') {
      tasks.forEach((task) => {
        const taskMarkerDiv = document.createElement('div');
        taskMarkerDiv.className = 'w-8 h-8 bg-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:w-10 hover:h-10 transition-all';
        taskMarkerDiv.innerHTML = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.728 0-7.333-.57-10.759-1.697m13.573-1.3c.454.164.915.295 1.386.parameternull 0 0 0 0 0 0m0 0A23.931 23.931 0 0112 3c-3.728 0-7.333.57-10.759 1.697m13.573 1.3c-.454-.164-.915-.295-1.386-.297m0 0a23.931 23.931 0 00-13.573-1.3m0 0a23.931 23.931 0 0010.759-1.697"></path></svg>`;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3 bg-white rounded-lg shadow-lg max-w-xs">
            <h3 class="font-bold text-gray-800">${task.title}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">${task.description}</p>
            <div class="mt-2 text-xs text-gray-600">
              <p>💰 Budget: $${task.budget}</p>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(taskMarkerDiv)
          .setLngLat([task.location.coordinates[0], task.location.coordinates[1]])
          .setPopup(popup)
          .addTo(map.current);

        taskMarkerDiv.addEventListener('click', () => {
          marker.togglePopup();
        });

        markersRef.current.push(marker);
      });
    }
  }, [workers, tasks, userLocation, viewType]);

  // Live location tracking
  useEffect(() => {
    if (!liveLocation || !navigator.geolocation) return;

    let consecutiveErrors = 0;
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        consecutiveErrors = 0; // Reset error counter on success
        
        // Periodically update location in backend
        userAPI.updateUserLocation({
          latitude,
          longitude,
          accuracy: position.coords.accuracy,
        }).catch(err => {
          // Silent catch - don't log on success
        });
      },
      (error) => {
        consecutiveErrors++;
        // Only log after multiple consecutive errors to reduce noise
        if (consecutiveErrors === 1) {
          // Silent fail - geolocation timeouts are common and expected
          // User can still use the map with default location
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000, // Increased from 5000ms
        timeout: 20000, // Increased from 10000ms to allow more time for location fix
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [liveLocation]);

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Navigation className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 max-w-xs z-10">
        {/* Radius Slider */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Radius: {radius} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Live Location Toggle */}
        <button
          onClick={() => setLiveLocation(!liveLocation)}
          className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            liveLocation
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Navigation size={16} />
          {liveLocation ? 'Live Location ON' : 'Live Location OFF'}
        </button>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs">
          <p className="font-semibold text-gray-700 mb-2">Legend:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
              <span>Workers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              <span>Tasks</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-4 text-xs text-gray-600 animate-pulse">
            Loading nearby items...
          </div>
        )}

        {/* Results Summary */}
        {!loading && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs space-y-1">
            <p className="font-semibold text-gray-700">Results:</p>
            <p className="text-gray-600">
              <Users size={14} className="inline mr-1" />
              Workers: {workers.length}
            </p>
            <p className="text-gray-600">
              <Briefcase size={14} className="inline mr-1" />
              Tasks: {tasks.length}
            </p>
            {workers.length === 0 && tasks.length === 0 && (
              <p className="text-amber-600 font-medium mt-2">
                No profiles found. Try increasing the search radius.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapViewMapbox;

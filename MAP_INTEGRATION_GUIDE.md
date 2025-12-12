# Map Integration Setup Guide

## 🗺️ Overview

This document explains how to set up and use the new map-based discovery feature in your TaskFlow application.

## 📋 Features

- **View nearby workers** on an interactive Google Map
- **Find available tasks** in your area
- **Adjust search radius** from 1-50 km
- **Click on markers** to view detailed profiles
- **Real-time distance calculation** from your location
- **Filter by workers or tasks** using view type selector

## 🔧 Installation & Setup

### 1. **Get Google Maps API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
4. Go to Credentials → Create API Key
5. Restrict the key to your domain(s)
6. Copy the API key

### 2. **Update Frontend Environment**

Create a `.env.local` file in `/project-1/project/`:

```env
VITE_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

### 3. **Update Backend Models**

Your User and Task models need location fields. Add/update these schemas:

**User Model:**
```javascript
location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: [78.4867, 17.3850] // Default: Hyderabad
  }
},
address: String,
```

**Task Model:**
```javascript
location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: [78.4867, 17.3850]
  }
},
```

Then create MongoDB geospatial indices:

```javascript
// In your database initialization
db.users.createIndex({ "location": "2dsphere" })
db.tasks.createIndex({ "location": "2dsphere" })
```

### 4. **API Endpoints Created**

#### **For Users (Workers)**

**Get Nearby Workers**
```
POST /api/users/nearby/workers
Headers: Authorization: Bearer {token}
Body: {
  "latitude": 17.3850,
  "longitude": 78.4867,
  "radius": 5  // in kilometers
}
Response: { success: true, workers: [...] }
```

**Update User Location**
```
PUT /api/users/location
Headers: Authorization: Bearer {token}
Body: {
  "latitude": 17.3850,
  "longitude": 78.4867,
  "address": "Hyderabad, Telangana" // optional
}
Response: { success: true, user: {...} }
```

#### **For Tasks**

**Get Nearby Tasks**
```
POST /api/tasks/nearby
Headers: Authorization: Bearer {token}
Body: {
  "latitude": 17.3850,
  "longitude": 78.4867,
  "radius": 5  // in kilometers
}
Response: { success: true, tasks: [...] }
```

## 📱 How to Use

### **For Users:**

1. **Navigate to Map**
   - Click "Map" in the navbar
   - Allow location permission when prompted
   - Your location appears as a blue dot

2. **Filter View**
   - Choose "All (Workers & Tasks)"
   - Choose "Active Workers"
   - Choose "Available Tasks"

3. **Adjust Radius**
   - Use the slider to change search radius (1-50 km)
   - Map updates automatically

4. **View Details**
   - Click on any marker (cyan = worker, pink = task)
   - Info window appears with details
   - Click "View Profile" or "Apply Now"

### **For Developers:**

#### **MapView Component** (`src/components/MapView.jsx`)

Usage:
```jsx
import MapView from '../components/MapView';

// Show both workers and tasks
<MapView viewType="both" />

// Show only workers
<MapView viewType="workers" />

// Show only tasks
<MapView viewType="tasks" />

// With custom location
<MapView viewType="both" userLocation={{ lat: 40.7128, lng: -74.0060 }} />
```

#### **DiscoveryMap Page** (`src/pages/DiscoveryMap.jsx`)

A complete standalone page with hero section, controls, and map.

## 🎨 Marker Colors & Icons

- **Blue dot** (Indigo) - Your location
- **Cyan circle** - Active Workers
- **Pink circle** - Available Tasks
- **Gray circle** - Default locations

## 🚀 Advanced Features

### **Auto-update Worker/Task Locations**

Update user location periodically:
```javascript
import { userAPI } from '../services/api';

// Update location every 5 minutes
setInterval(() => {
  navigator.geolocation.getCurrentPosition((pos) => {
    userAPI.updateUserLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });
  });
}, 5 * 60 * 1000);
```

### **Notification for Nearby Tasks**

```javascript
// When new task posted near user
const distance = calculateDistance(userLat, userLng, taskLat, taskLng);
if (distance < 5) {
  // Show notification
  showNotification(`New task ${distance}km away!`);
}
```

### **Customizing Map Styles**

Edit the map styles in `MapView.jsx`:
```javascript
<GoogleMap
  options={{
    styles: [ /* your custom styles */ ]
  }}
/>
```

## 🔐 Privacy Considerations

- Users can toggle location sharing on/off
- Show approximate location (rounded to 0.1km) initially
- Exact location revealed only after mutual agreement
- Implement "Location History" with auto-deletion

## 📊 Database Optimization

For large-scale deployments:

```javascript
// Create compound index for efficient queries
db.users.createIndex({ 
  "location": "2dsphere",
  "rating": -1
})

db.tasks.createIndex({
  "location": "2dsphere",
  "status": 1,
  "createdAt": -1
})
```

## ❌ Troubleshooting

### **Map Not Loading**
- Check Google Maps API key in .env
- Verify API key has correct permissions
- Check browser console for errors

### **Geolocation Not Working**
- User must grant location permission
- Site must be HTTPS (except localhost)
- Check browser geolocation settings

### **No Workers/Tasks Showing**
- Verify location data exists in database
- Check MongoDB geospatial index is created
- Increase search radius
- Verify MongoDB GeoJSON format is correct

### **Performance Issues**
- Reduce search radius
- Implement pagination for results
- Cache frequently searched areas
- Use web workers for heavy calculations

## 📚 Resources

- [Google Maps API Docs](https://developers.google.com/maps/documentation)
- [react-google-maps Docs](https://react-google-maps-api-docs.netlify.app/)
- [MongoDB Geospatial Queries](https://docs.mongodb.com/manual/geospatial-queries/)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

## 🎯 Future Enhancements

- [ ] Real-time location tracking with WebSockets
- [ ] Route optimization (A to B)
- [ ] Heatmaps of task density
- [ ] Location-based recommendations
- [ ] Privacy zones (don't show exact location)
- [ ] Custom markers for different task types
- [ ] Offline map support
- [ ] Mobile-first map UI

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review console logs
3. Verify API credentials
4. Check MongoDB connection

---

**Happy mapping! 🗺️✨**

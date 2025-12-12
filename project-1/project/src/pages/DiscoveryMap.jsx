import React, { useState } from 'react';
import { Map, Users, Briefcase, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import MapViewMapbox from '../components/MapViewMapbox';

const DiscoveryMap = () => {
  const [viewType, setViewType] = useState('both');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover Nearby
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl">
            Find workers and tasks near you. Connect with local professionals and get your work done faster.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        {/* View Type Selector */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setViewType('both')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              viewType === 'both'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            All (Workers & Tasks)
          </button>
          <button
            onClick={() => setViewType('workers')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              viewType === 'workers'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
            }`}
          >
            <Users className="w-5 h-5" />
            Active Workers
          </button>
          <button
            onClick={() => setViewType('tasks')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              viewType === 'tasks'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Available Tasks
          </button>
        </div>

        {/* Map Component */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-screen md:h-96 lg:h-[600px]">
          <MapViewMapbox viewType={viewType} />
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">Find Local Workers</h3>
            </div>
            <p className="text-sm text-gray-600">
              Discover skilled professionals in your area. View ratings, completed tasks, and rates before connecting.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900">Nearby Tasks</h3>
            </div>
            <p className="text-sm text-gray-600">
              See all available tasks near you. Check budget, requirements, and apply instantly with a single click.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Map className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">Smart Filtering</h3>
            </div>
            <p className="text-sm text-gray-600">
              Adjust search radius, filter by distance, rating, and budget. Find exactly what you need within kilometers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryMap;

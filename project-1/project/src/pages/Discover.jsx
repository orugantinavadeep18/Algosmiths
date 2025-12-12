import React, { useState } from 'react';
import { Grid, Plus, Loader, AlertCircle, Zap, Layout } from 'lucide-react';
import Navbar from '../components/Navbar';

const Discover = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Categories', icon: '🌐', count: '1200+' },
    { id: 'tech', name: 'Technology', icon: '💻', count: '450+' },
    { id: 'design', name: 'Design & Creative', icon: '🎨', count: '320+' },
    { id: 'writing', name: 'Writing & Content', icon: '✍️', count: '280+' },
    { id: 'home', name: 'Home Services', icon: '🏠', count: '350+' },
    { id: 'delivery', name: 'Delivery & Pickup', icon: '📦', count: '420+' },
    { id: 'tutoring', name: 'Tutoring & Education', icon: '📚', count: '190+' },
    { id: 'other', name: 'Other Services', icon: '⚡', count: '240+' },
  ];

  const popularTasks = [
    { title: 'Website Development', description: 'Build responsive websites', budget: '$500-2000', difficulty: 'Intermediate' },
    { title: 'Logo Design', description: 'Create professional branding', budget: '$100-500', difficulty: 'Beginner' },
    { title: 'Content Writing', description: 'Write blog posts and articles', budget: '$50-300', difficulty: 'Beginner' },
    { title: 'Virtual Assistant', description: 'General administrative tasks', budget: '$200-800', difficulty: 'Beginner' },
  ];

  return (
    <div style={{ backgroundColor: '#fdfaf7' }} className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold bg-white/20 px-4 py-1 rounded-full">Explore Opportunities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Discover Tasks & Services</h1>
          <p className="text-blue-50 text-lg">Find opportunities across different categories and get started today</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Layout className="w-8 h-8 text-blue-600" />
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-600 text-white shadow-xl'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-blue-400 shadow-lg'
                }`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                <p className={`text-sm ${activeCategory === category.id ? 'text-blue-100' : 'text-gray-600'}`}>
                  {category.count}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Tasks Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Grid className="w-8 h-8 text-blue-600" />
            Popular Tasks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTasks.map((task, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="font-semibold text-blue-600">{task.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      task.difficulty === 'Beginner' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {task.difficulty}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                  Explore More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Why Discover with TaskFlow?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wide Selection</h3>
              <p className="text-gray-600">Browse from hundreds of tasks across different categories</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Competitive Rates</h3>
              <p className="text-gray-600">Find tasks with budgets that match your skills and time</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">All tasks are verified and protected by our guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;

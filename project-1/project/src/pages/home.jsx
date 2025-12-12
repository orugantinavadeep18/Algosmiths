import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Briefcase, Clock, DollarSign, TrendingUp, Shield } from "lucide-react";
import Lottie from "lottie-react";
import connectionAnimation from "../assets/Connectionpeople.json";
import logoImg from "../assets/logo.png";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "I earn extra income during my free time. TaskFlow's flexibility is unmatched!",
      name: "Priya Sharma",
      role: "Part-time Tasker",
      image: "PS"
    },
    {
      text: "Posted a task and got it done within hours. The quality exceeded my expectations!",
      name: "Rajesh Kumar",
      role: "Task Poster",
      image: "RK"
    },
    {
      text: "Perfect for students like me. I work when I want and earn decent money.",
      name: "Anita Desai",
      role: "Student Tasker",
      image: "AD"
    },
  ];

  const categories = [
    { icon: "📦", title: "Delivery & Pickup", tasks: "450+ tasks" },
    { icon: "🏠", title: "Home Services", tasks: "320+ tasks" },
    { icon: "💻", title: "Digital Tasks", tasks: "680+ tasks" },
    { icon: "✍️", title: "Writing & Content", tasks: "290+ tasks" },
    { icon: "🎨", title: "Design & Creative", tasks: "410+ tasks" },
    { icon: "🔧", title: "Repairs & Maintenance", tasks: "230+ tasks" },
  ];

  const benefits = [
    {
      icon: <Clock className="text-white" size={28} />,
      title: "Work Anytime",
      description: "Choose tasks that fit your schedule. Work when you want, where you want.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <DollarSign className="text-white" size={28} />,
      title: "Earn More",
      description: "Set your own rates. The more tasks you complete, the more you earn.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Shield className="text-white" size={28} />,
      title: "Safe & Secure",
      description: "Verified users, secure payments, and insurance protection on every task.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <TrendingUp className="text-white" size={28} />,
      title: "Build Reputation",
      description: "Earn ratings and reviews. Top performers get priority access to premium tasks.",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="w-full bg-white">
    <Navbar/>
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 md:mb-6 whitespace-normal">
                🚀 Join 50,000+ taskers earning today
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Turn Your Free Time Into
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Income</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                The marketplace where people post tasks and skilled workers earn money. Find work that fits your schedule, or get help with your tasks instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={() => navigate('/accept-task')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 md:py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto">
                  <Briefcase size={18} className="md:w-5 md:h-5" />
                  Find Tasks & Earn
                </button>
                <button onClick={() => navigate('/post-task')} className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 md:py-4 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-sm md:text-base w-full sm:w-auto">
                  Post a Task
                </button>
              </div>
              <div className="mt-8 md:mt-12 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-start gap-6 sm:gap-8">
                  <div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">50K+</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Active Taskers</div>
                  </div>
                  <div className="hidden sm:block h-12 w-px bg-gray-300"></div>
                  <div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">2M+</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Tasks Completed</div>
                  </div>
                  <div className="hidden sm:block h-12 w-px bg-gray-300"></div>
                  <div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">₹500+</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Avg. Daily Earning</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <Lottie
                animationData={connectionAnimation}
                loop
                autoplay
                className="w-full max-w-lg mx-auto"
                style={{ height: 400 }}
              />
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-3xl -z-10 opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl -z-10 opacity-50"></div>
            </div>
          </div>
        </div>
      </section>
{/* Benefits Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 md:mb-4">
              WHY TASKFLOW
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              The Future of Freelance Work
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Whether you're earning or hiring, TaskFlow makes it simple, safe, and rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-white p-6 sm:p-8 rounded-2xl h-full border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className={`w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{benefit.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Task Categories */}
      <section id="features" className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-purple-100 text-purple-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 md:mb-4">
              EXPLORE CATEGORIES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Tasks in Every Category
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Browse thousands of tasks across diverse categories and start earning today
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 text-center">{category.icon}</div>
                <h3 className="font-bold text-gray-900 text-center mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">{category.title}</h3>
                <p className="text-xs text-gray-600 text-center">{category.tasks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* How It Works - Dual Process */}
      <section id="how-it-works" className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 md:mb-4">
              SIMPLE PROCESS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How TaskFlow Works
            </h2>
          </div>

          {/* For Taskers */}
          <div className="mb-16 md:mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                For People Who Want to Earn
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">Turn your free time into income in 4 simple steps</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 -z-10"></div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Sign Up Free</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Create your profile in minutes. Add your skills and availability.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Browse Tasks</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Explore available tasks near you. Filter by category and payment.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Complete Work</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Accept tasks, complete them on time, and deliver quality work.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">4</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Get Paid</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Receive instant payment after task completion. Build your rating!
                </p>
              </div>
            </div>
          </div>

          {/* For Task Posters */}
          <div id="post-task">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                For People Who Need Help
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">Get your tasks done quickly by skilled workers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 -z-10"></div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Post Your Task</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Describe what you need. Set location, deadline, and budget.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Review Offers</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Get proposals from verified workers. Check ratings and reviews.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Choose Worker</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Select the best match. Track progress in real-time.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">4</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Task Done</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Approve completed work. Payment released automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-yellow-100 text-yellow-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 md:mb-4">
              SUCCESS STORIES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Real stories from real people earning and getting work done
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed text-sm sm:text-base">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                    {testimonial.image}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                2M+
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">Tasks Completed</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">Active Taskers</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                ₹2Cr+
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">Paid to Taskers</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                4.8★
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 md:mb-8 px-4">
            Join thousands of people earning money or getting work done on TaskFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button onClick={() => navigate('/accept-task')} className="bg-white text-blue-600 px-6 sm:px-8 py-3 md:py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto">
              <Briefcase size={18} className="md:w-5 md:h-5" />
              Start Earning Today
            </button>
            <button onClick={() => navigate('/post-task')} className="border-2 border-white text-white px-6 sm:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 text-sm md:text-base w-full sm:w-auto">
              Post Your First Task
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex-shrink-0"></div>
                <h3 className="text-xl sm:text-2xl font-bold">TaskFlow</h3>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                The marketplace connecting tasks with talented people.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4 text-sm sm:text-base">For Taskers</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Find Tasks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Earn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4 text-sm sm:text-base">For Posters</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Post a Task</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2024 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Add scroll animation for elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-4">
              Modern Testing Platform
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900 tracking-tight mb-6">
              Test with confidence, <br className="hidden md:block" />
              <span className="text-blue-600">simplify assessment</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Create, manage, and take tests in a modern, intuitive environment. Perfect for educators, businesses, and learners.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?mode=register">
                <Button size="lg" className="btn-primary text-lg px-8 py-6">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button variant="outline" size="lg" className="bg-white text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent h-20 -bottom-1"></div>
            <div className="glass-card rounded-2xl shadow-xl mx-auto max-w-4xl overflow-hidden animate-zoom-in">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
                alt="BlueCBT Platform" 
                className="w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Everything you need in one platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive testing solution helps you create better assessments with less effort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-8 shadow transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Rich Question Types</h3>
              <p className="text-gray-600">
                Create diverse questions with images, formatting, and multiple answer types to test understanding comprehensively.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-8 shadow transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Intuitive Test Experience</h3>
              <p className="text-gray-600">
                Provide a distraction-free environment for test-takers with a clean, modern interface that keeps them focused.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-8 shadow transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Detailed Analytics</h3>
              <p className="text-gray-600">
                Get comprehensive insights into test performance with detailed reports and analytics to improve your assessments.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-8 shadow transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Customizable Scoring</h3>
              <p className="text-gray-600">
                Define your own scoring system with point values per question and automatic grading for immediate feedback.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-8 shadow transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Secure Testing</h3>
              <p className="text-gray-600">
                Ensure the integrity of your assessments with built-in security measures and role-based access control.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-8 shadow transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600">
                  <path d="M2 9.88 5.12 13 8.24 9.88"></path>
                  <path d="M8 17.29 12.12 21l4.24-3.71"></path>
                  <path d="M16 14h-2.12c-1.68 0-3.32.93-4.12 2.56"></path>
                  <circle cx="18" cy="5" r="3"></circle>
                  <path d="M10 5.5c0-1.1.9-2 2-2s2 .9 2 2v11.5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Role-Based Access</h3>
              <p className="text-gray-600">
                Different permissions for administrators, question creators, and test-takers to ensure appropriate access levels.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-10 lg:mb-0 lg:max-w-xl animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold mb-6">
                Ready to transform your testing experience?
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Join thousands of educators and businesses who have improved their assessment process with BlueCBT.
              </p>
              <Link to="/auth?mode=register">
                <Button variant="secondary" size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6">
                  Start Using BlueCBT Today
                </Button>
              </Link>
            </div>
            <div className="lg:pl-20 animate-on-scroll opacity-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-md">
                    <h3 className="text-2xl font-bold mb-1">100%</h3>
                    <p className="text-blue-100">User Satisfaction</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-md">
                    <h3 className="text-2xl font-bold mb-1">97%</h3>
                    <p className="text-blue-100">Time Saved</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-md">
                    <h3 className="text-2xl font-bold mb-1">5000+</h3>
                    <p className="text-blue-100">Active Users</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-md">
                    <h3 className="text-2xl font-bold mb-1">10k+</h3>
                    <p className="text-blue-100">Tests Created</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

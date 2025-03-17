import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { Home, Book, Calendar, Users, Settings, ChevronRight, Bell, Search, Gift, FileText, Ticket, Menu, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Carousel from "@/components/Carousel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data for user's exam history
const mockTestHistory = [
  { name: "Mathematics", score: 85 },
  { name: "English", score: 72 },
  { name: "Science", score: 68 },
  { name: "Computer Science", score: 92 },
];

// Sample recent exams data
const recentExams = [
  { id: 1, title: "Mathematics Tryout Test", date: "2 days ago", score: 85 },
  { id: 2, title: "English Language Proficiency", date: "1 week ago", score: 72 },
];

// Sample upcoming exams
const upcomingExams = [
  { id: 3, title: "Science Fundamentals", deadline: "Tomorrow, 3:00 PM", difficulty: "Hard" },
  { id: 4, title: "Computer Science Basics", deadline: "Aug 15, 10:00 AM", difficulty: "Medium" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth?mode=login");
    } else {
      setIsLoggedIn(true);
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    navigate('/auth?mode=login');
  };

  const handleFreeTryout = () => {
    navigate("/free-tryout");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FC] relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed z-50 bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static lg:translate-x-0 z-40
        w-[280px] bg-white min-h-screen border-r border-gray-200
        transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-red-600">Jago</span>
            <span className="font-bold text-2xl">CPNS</span>
          </div>
        </div>
        
        <div className="p-6">
          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 text-red-600">
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </a>
            <a href="/pusat-langganan" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">TryOut Saya</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </a>
            <div className="pt-4 pb-2">
              <div className="px-4 text-sm font-semibold text-gray-900">
                Fokus CPNS 2024
              </div>
            </div>
            <a href="/materi" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Book className="w-5 h-5" />
                <span className="font-medium">Materi</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </a>
            <a href="/tryout" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Tryout</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 space-y-4 sm:space-y-0">
            <div className="w-full sm:flex-1 sm:max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  type="search"
                  placeholder="Cari materi pembelajaran..."
                  className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-8">
          {/* Carousel Section */}
          <div className="mb-6 sm:mb-8">
            <Carousel />
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <button
              onClick={handleFreeTryout}
              className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-300 transition-all group"
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100">
                <Gift className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Coba Tryout Gratis</h3>
              <p className="text-sm text-gray-600">
                Rasakan pengalaman tryout dengan soal-soal berkualitas secara gratis
              </p>
            </button>

            <button className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-300 transition-all group">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Beli Paket Sekarang</h3>
              <p className="text-sm text-gray-600">
                Akses penuh ke semua materi dan tryout premium
              </p>
            </button>

            <button className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-300 transition-all group">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100">
                <Ticket className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cek Info Event</h3>
              <p className="text-sm text-gray-600">
                Dapatkan informasi terbaru tentang event dan webinar
              </p>
            </button>
        </div>
        
          {/* Progress and Schedule Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Welcome Card */}
            <div className="lg:col-span-2 bg-gradient-to-r from-red-600 to-red-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Selamat Datang, {user?.name}! 👋</h1>
              <p className="text-red-100 mb-4 sm:mb-6">Yuk mulai persiapan CPNS 2024 dari sekarang</p>
              <button className="bg-white text-red-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium hover:bg-red-50">
                Mulai Belajar
              </button>
              </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Progress Belajar</h3>
              <div className="space-y-4">
                      <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tryout Selesai</span>
                    <span className="font-medium">8/12</span>
                      </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-red-600 rounded-full" style={{ width: '66.67%' }}></div>
                      </div>
                    </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Rata-rata Nilai</span>
                    <span className="font-medium">85.5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-red-600 rounded-full" style={{ width: '85.5%' }}></div>
                  </div>
                </div>
              </div>
        </div>
        
            {/* Latest Tryout */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Tryout Terbaru</h3>
                <a href="/tryout" className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Lihat Semua
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/exam/1" className="block p-4 border border-gray-200 rounded-xl hover:border-red-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">TO Number Sequence</h4>
                      <p className="text-sm text-gray-500 mt-1">25 Soal • 30 Menit</p>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                      Baru
                    </span>
                      </div>
                </a>
                <a href="/exam/2" className="block p-4 border border-gray-200 rounded-xl hover:border-red-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">TO Verbal Analogy</h4>
                      <p className="text-sm text-gray-500 mt-1">20 Soal • 25 Menit</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Jadwal Tryout</h3>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">TO Matematika</h4>
                    <p className="text-sm text-gray-500">Senin, 15 Maret 2024</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">TO Bahasa Inggris</h4>
                    <p className="text-sm text-gray-500">Rabu, 17 Maret 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-2xl text-red-600">Jago</span>
              <span className="font-bold text-2xl">CPNS</span>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/default.png" alt="Profile" />
                      <AvatarFallback>BP</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Bapak</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        bapak@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;

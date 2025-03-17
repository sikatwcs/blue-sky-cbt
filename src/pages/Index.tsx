import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Timer, Users, Star, ChevronRight, GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah ada token di localStorage
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    // Jika token ada dan waktu login masih valid (24 jam)
    if (token && loginTime) {
      const now = new Date().getTime();
      const loginTimestamp = parseInt(loginTime);
      const timeElapsed = now - loginTimestamp;
      const hoursElapsed = timeElapsed / (1000 * 60 * 60);
      
      if (hoursElapsed < 24) {
        setIsLoggedIn(true);
      } else {
        // Token expired, hapus data login
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogin = () => {
    // Set token dan waktu login
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('loginTime', new Date().getTime().toString());
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Hapus semua data login
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    navigate('/auth?mode=login');
  };

  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-red-600" />,
      title: "Materi Lengkap",
      description: "Akses materi pembelajaran yang komprehensif dan terstruktur untuk persiapan CPNS 2024"
    },
    {
      icon: <Timer className="w-6 h-6 text-red-600" />,
      title: "Tryout Berkualitas",
      description: "Latihan soal dengan standar CAT BKN untuk membiasakan diri dengan sistem ujian CPNS"
    },
    {
      icon: <Users className="w-6 h-6 text-red-600" />,
      title: "Grup Diskusi",
      description: "Bergabung dengan komunitas belajar untuk berbagi pengalaman dan tips sukses CPNS"
    }
  ];

  const packages = [
    {
      name: "Paket Basic",
      price: "99.000",
      duration: "1 Bulan",
      features: [
        "10 Paket Tryout",
        "Pembahasan Soal",
        "Grup Diskusi",
        "Materi Dasar"
      ]
    },
    {
      name: "Paket Premium",
      price: "249.000",
      duration: "3 Bulan",
      isPopular: true,
      features: [
        "30 Paket Tryout",
        "Pembahasan Video",
        "Grup Diskusi Premium",
        "Materi Lengkap",
        "Konsultasi Pribadi",
        "Simulasi CAT BKN"
      ]
    },
    {
      name: "Paket Ultimate",
      price: "399.000",
      duration: "6 Bulan",
      features: [
        "60 Paket Tryout",
        "Pembahasan Video",
        "Grup Diskusi Premium",
        "Materi Lengkap",
        "Konsultasi Pribadi",
        "Simulasi CAT BKN",
        "Garansi Kelulusan"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-2xl text-red-600">Jago</span>
              <span className="font-bold text-2xl">CPNS</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-red-600">Fitur</a>
              <a href="#packages" className="text-gray-600 hover:text-red-600">Paket</a>
              <a href="#testimonials" className="text-gray-600 hover:text-red-600">Testimoni</a>
              {isLoggedIn ? (
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
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      Profil Saya
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      Pengaturan
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
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-red-600"
                    onClick={handleLogin}
                  >
                    Masuk
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => navigate("/auth?mode=register")}
                  >
                    Daftar Sekarang
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-red-100 text-red-600 mb-4 hover:bg-red-100">
                Platform Belajar CPNS #1
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Persiapkan Dirimu untuk{" "}
                <span className="text-red-600">CPNS 2024</span>
            </h1>
              <p className="text-lg text-gray-600 mb-8">
                Platform belajar online terlengkap dengan ribuan soal latihan dan materi pembelajaran yang diupdate secara berkala.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => navigate("/auth?mode=register")}
                >
                  Mulai Belajar
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => navigate("/free-tryout")}
                >
                  Coba Gratis
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">50K+</div>
                  <div className="text-sm text-gray-600">Pengguna Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">95%</div>
                  <div className="text-sm text-gray-600">Tingkat Kelulusan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">100+</div>
                  <div className="text-sm text-gray-600">Paket Tryout</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/Banner 3.jpg"
                alt="Hero"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-gray-900">4.9/5.0</span>
                </div>
                <div className="text-sm text-gray-600">Rating Pengguna</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Packages Section */}
      <div id="packages" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-600 mb-4 hover:bg-red-100">
              Pilih Paket Terbaikmu
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paket Belajar yang Sesuai Kebutuhanmu
            </h2>
            <p className="text-lg text-gray-600">
              Kami menyediakan berbagai paket belajar yang dapat disesuaikan dengan kebutuhanmu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative p-6 bg-white rounded-2xl border ${
                  pkg.isPopular ? 'border-red-300 shadow-xl' : 'border-gray-200'
                } hover:border-red-300 transition-all duration-200`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-red-600 text-white hover:bg-red-600">
                      Paling Populer
                    </Badge>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-sm text-gray-600 mb-4">{pkg.duration}</div>
                  <div className="text-3xl font-bold text-red-600 mb-1">Rp{pkg.price}</div>
                </div>
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <ChevronRight className="w-5 h-5 text-red-600" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full ${
                    pkg.isPopular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-white border-red-600 text-red-600 hover:bg-red-50'
                  }`}
                  variant={pkg.isPopular ? 'default' : 'outline'}
                  onClick={() => navigate("/auth?mode=register")}
                >
                  Pilih Paket
                </Button>
              </div>
            ))}
            </div>
              </div>
            </div>
            
      {/* Statistics Section */}
      <div className="py-16 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-red-100">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-red-100">Tingkat Kelulusan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-red-100">Paket Tryout</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-red-100">Rating Pengguna</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-bold text-2xl text-red-600">Jago</span>
                <span className="font-bold text-2xl">CPNS</span>
              </div>
              <p className="text-gray-600">
                Platform belajar online untuk persiapan CPNS 2024
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Produk</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Tryout CPNS
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Materi Pembelajaran
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Grup Diskusi
                  </a>
                </li>
              </ul>
                  </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Karir
                  </a>
                </li>
              </ul>
                  </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Bantuan</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    Syarat dan Ketentuan
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            © 2024 JagoCPNS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

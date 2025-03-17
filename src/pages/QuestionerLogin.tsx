import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const QuestionerLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Credentials khusus untuk questioner
  const QUESTIONER_CREDENTIALS = {
    username: "questioner_bumn",
    password: "bumn2024#secure"
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === QUESTIONER_CREDENTIALS.username && 
        password === QUESTIONER_CREDENTIALS.password) {
      // Set token dan role questioner
      localStorage.setItem('token', 'questioner-token');
      localStorage.setItem('role', 'questioner');
      localStorage.setItem('loginTime', new Date().getTime().toString());
      
      // Redirect ke dashboard questioner
      navigate('/questioner/dashboard');
    } else {
      setError("Username atau password tidak valid");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-bold text-2xl text-red-600">Jago</span>
            <span className="font-bold text-2xl">CPNS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Login Questioner</h1>
          <p className="text-gray-600">
            Masuk sebagai pembuat soal CBT BUMN
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Masuk
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Kembali ke{" "}
          <button
            onClick={() => navigate("/auth?mode=login")}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Login Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionerLogin; 
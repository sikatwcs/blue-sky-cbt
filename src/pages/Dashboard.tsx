
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  const [examsTaken, setExamsTaken] = useState(2);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/auth?mode=login");
    } else {
      // Calculate average score from mock data
      const total = mockTestHistory.reduce((acc, exam) => acc + exam.score, 0);
      setAvgScore(Math.round(total / mockTestHistory.length));
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Here's your test preparation dashboard</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/exams">
              <Button>Browse Exams</Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Exams Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{examsTaken}</div>
              <p className="text-sm text-gray-500 mt-1">
                {examsTaken > 0 ? "Your journey has begun!" : "Start your first exam today!"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgScore}%</div>
              <p className="text-sm text-gray-500 mt-1">
                {avgScore >= 80 
                  ? "Excellent work!" 
                  : avgScore >= 60 
                    ? "Good progress!" 
                    : "Keep practicing!"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Next Scheduled Exam</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-blue-600">{upcomingExams[0]?.title || "None"}</div>
              <p className="text-sm text-gray-500 mt-1">
                {upcomingExams[0]?.deadline || "Schedule a new exam now"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Exams and Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Score distribution across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockTestHistory}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Exams</CardTitle>
              <CardDescription>
                Your latest test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExams.map(exam => (
                  <div key={exam.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{exam.title}</h4>
                        <p className="text-sm text-gray-500">{exam.date}</p>
                      </div>
                      <div className={`text-lg font-semibold ${
                        exam.score >= 80 ? "text-green-600" : 
                        exam.score >= 60 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {exam.score}%
                      </div>
                    </div>
                  </div>
                ))}

                {recentExams.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No exams taken yet
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/exams" className="w-full">
                <Button variant="outline" className="w-full">View All Exams</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>
              Scheduled tests that you can prepare for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{exam.title}</h4>
                      <p className="text-sm text-gray-500">Due: {exam.deadline}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex space-x-2">
                      <div className={`text-sm px-2 py-1 rounded ${
                        exam.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                        exam.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {exam.difficulty}
                      </div>
                      <Link to={`/exam/${exam.id}`}>
                        <Button size="sm" variant="outline">Start Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingExams.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  No upcoming exams scheduled
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/exams" className="w-full">
              <Button className="w-full">Browse All Exams</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

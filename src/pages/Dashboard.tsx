
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/utils/auth';
import { ProtectedRoute } from '@/utils/routes';
import { BookOpen, Clock, CheckCircle, BarChart3, Calendar } from 'lucide-react';

// Mock data for the dashboard
const recentTests = [
  {
    id: 1,
    title: 'Mathematics Fundamentals',
    date: '2023-10-15',
    score: 85,
    totalQuestions: 20,
    timeSpent: '45 minutes',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Science Concepts',
    date: '2023-10-10',
    score: 72,
    totalQuestions: 15,
    timeSpent: '30 minutes',
    status: 'completed',
  },
  {
    id: 3,
    title: 'History Examination',
    date: '2023-09-28',
    score: 90,
    totalQuestions: 25,
    timeSpent: '50 minutes',
    status: 'completed',
  },
];

const upcomingTests = [
  {
    id: 4,
    title: 'Language Arts',
    scheduled: '2023-10-25',
    duration: '60 minutes',
    questions: 30,
  },
  {
    id: 5,
    title: 'Geography Quiz',
    scheduled: '2023-10-30',
    duration: '45 minutes',
    questions: 25,
  },
];

const performanceData = {
  average: 82,
  best: 'History Examination (90%)',
  completed: 3,
  upcoming: 2,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Add animations when component mounts
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-slide-up');
        card.classList.remove('opacity-0');
      }, index * 100);
    });
  }, []);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-blue-50/50">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:flex md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-blue-900">
                  Welcome back, {user?.name}
                </h1>
                <p className="mt-1 text-lg text-gray-600">
                  Track your progress and manage your tests in one place.
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                  {user?.role === 'admin'
                    ? 'Administrator'
                    : user?.role === 'questioner'
                      ? 'Question Creator'
                      : 'Student'}
                </Badge>
              </div>
            </header>
            
            <Tabs 
              defaultValue="overview" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="bg-blue-100/50 p-1">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="tests" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
                >
                  My Tests
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
                >
                  Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="dashboard-card opacity-0 shadow-sm hover:shadow transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-blue-900">{performanceData.average}%</div>
                          <Progress value={performanceData.average} className="h-1.5 mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="dashboard-card opacity-0 shadow-sm hover:shadow transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Best Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <div className="text-lg font-bold text-blue-900">{performanceData.best}</div>
                          <p className="text-sm text-gray-500">Your highest score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="dashboard-card opacity-0 shadow-sm hover:shadow transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Tests Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-blue-900">{performanceData.completed}</div>
                          <p className="text-sm text-gray-500">Total tests taken</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="dashboard-card opacity-0 shadow-sm hover:shadow transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Upcoming Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-blue-900">{performanceData.upcoming}</div>
                          <p className="text-sm text-gray-500">Tests scheduled</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="dashboard-card opacity-0 shadow-sm hover:shadow transition-all duration-300 h-full">
                      <CardHeader>
                        <CardTitle>Recent Test Results</CardTitle>
                        <CardDescription>Your performance on the latest tests</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {recentTests.map((test) => (
                            <div key={test.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-blue-900">{test.title}</h3>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{new Date(test.date).toLocaleDateString()}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{test.timeSpent}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-500 mr-2">Score:</span>
                                  <span className="font-semibold text-blue-900">{test.score}%</span>
                                </div>
                                <Badge className={
                                  test.score >= 80 
                                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                    : test.score >= 60 
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                }>
                                  {test.score >= 80 
                                    ? "Excellent" 
                                    : test.score >= 60 
                                      ? "Good"
                                      : "Needs Improvement"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="text-sm text-blue-600 hover:text-blue-800">
                        <a href="/results" className="inline-flex items-center">
                          View all test results
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="dashboard-card opacity-0 shadow-sm hover:shadow transition-all duration-300 h-full">
                      <CardHeader>
                        <CardTitle>Upcoming Tests</CardTitle>
                        <CardDescription>Tests scheduled for you</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingTests.map((test) => (
                            <div key={test.id} className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                              <h3 className="font-medium text-blue-900">{test.title}</h3>
                              <div className="mt-2 space-y-1 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>{new Date(test.scheduled).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>{test.duration}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>{test.questions} questions</span>
                                </div>
                              </div>
                              <button className="mt-3 w-full py-1.5 bg-white border border-blue-200 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors">
                                Set Reminder
                              </button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="text-sm text-blue-600 hover:text-blue-800">
                        <a href="/tests" className="inline-flex items-center">
                          View all available tests
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tests">
                <Card className="dashboard-card shadow-sm hover:shadow transition-all duration-300">
                  <CardHeader>
                    <CardTitle>My Tests</CardTitle>
                    <CardDescription>Manage your test activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Tests content coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="results">
                <Card className="dashboard-card shadow-sm hover:shadow transition-all duration-300">
                  <CardHeader>
                    <CardTitle>My Results</CardTitle>
                    <CardDescription>View detailed performance analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Results content coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;

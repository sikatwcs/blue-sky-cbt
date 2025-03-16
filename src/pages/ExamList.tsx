import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for exams - in a real app this would come from a database
const mockExams = [
  {
    id: 1,
    title: "Mathematics Tryout Test",
    description: "Test your math skills with this comprehensive tryout exam covering algebra, geometry, and calculus.",
    duration: 60,
    questionsCount: 50,
    category: "Mathematics",
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "English Language Proficiency",
    description: "Assess your English language skills with reading comprehension, grammar, and vocabulary questions.",
    duration: 45,
    questionsCount: 40,
    category: "English",
    difficulty: "Easy",
  },
  {
    id: 3,
    title: "Science Fundamentals",
    description: "Test your knowledge of basic science concepts including physics, chemistry, and biology.",
    duration: 90,
    questionsCount: 75,
    category: "Science",
    difficulty: "Hard",
  },
  {
    id: 4,
    title: "Computer Science Basics",
    description: "Evaluate your understanding of computer science concepts, algorithms, and programming logic.",
    duration: 60,
    questionsCount: 45,
    category: "Computer Science",
    difficulty: "Medium",
  },
];

const ExamList = () => {
  const { user } = useAuth();
  const [exams] = useState(mockExams);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Tryout Exams</h1>
          <p className="mt-2 text-gray-600">
            Select an exam below to start your practice test
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{exam.title}</CardTitle>
                  <Badge className={getDifficultyColor(exam.difficulty)}>
                    {exam.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 mt-2">
                  {exam.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{exam.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{exam.questionsCount} questions</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link to={`/exam/${exam.id}`} className="w-full">
                  <Button variant="default" className="w-full">Start Tryout</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamList;

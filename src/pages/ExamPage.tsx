
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Mock exam data - in a real app this would come from a database
const mockExams = {
  1: {
    id: 1,
    title: "Mathematics Tryout Test",
    duration: 60,
    questions: [
      {
        id: 1,
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "If a triangle has angles measuring 30° and 60°, what is the measure of the third angle?",
        options: ["30°", "60°", "90°", "120°"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is the area of a circle with radius 4 units?",
        options: ["4π square units", "8π square units", "12π square units", "16π square units"],
        correctAnswer: 3,
      },
      {
        id: 4,
        question: "Which of the following is a prime number?",
        options: ["15", "21", "29", "33"],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "What is the square root of 144?",
        options: ["9", "10", "12", "14"],
        correctAnswer: 2,
      },
    ],
  },
  2: {
    id: 2,
    title: "English Language Proficiency",
    duration: 45,
    questions: [
      {
        id: 1,
        question: "Which word is a synonym for 'benevolent'?",
        options: ["Malicious", "Kind", "Strict", "Lazy"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Identify the correct sentence:",
        options: [
          "They was going to the store.",
          "She don't like chocolate.",
          "He doesn't want to go.",
          "We is happy about the results."
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is the past tense of 'swim'?",
        options: ["Swimmed", "Swam", "Swum", "Swimming"],
        correctAnswer: 1,
      },
    ],
  },
  3: {
    id: 3,
    title: "Science Fundamentals",
    duration: 90,
    questions: [
      {
        id: 1,
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
      },
    ],
  },
  4: {
    id: 4,
    title: "Computer Science Basics",
    duration: 60,
    questions: [
      {
        id: 1,
        question: "What does CPU stand for?",
        options: [
          "Central Processing Unit", 
          "Computer Personal Unit", 
          "Central Program Utility", 
          "Central Processor Undergraduate"
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which of the following is not a programming language?",
        options: ["Java", "HTML", "Python", "C++"],
        correctAnswer: 1,
      },
    ],
  },
};

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const exam = mockExams[Number(examId) as keyof typeof mockExams];
  
  useEffect(() => {
    if (!exam) {
      navigate("/exams");
      toast.error("Exam not found");
      return;
    }
    
    // Initialize answers array with -1 (unanswered)
    setAnswers(new Array(exam.questions.length).fill(-1));
    
    // Set exam timer
    setTimeLeft(exam.duration * 60);
    
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examId, navigate]);

  if (!exam) {
    return null;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitExam = () => {
    let correctCount = 0;
    
    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / exam.questions.length) * 100);
    setScore(finalScore);
    setExamSubmitted(true);
  };
  
  if (examSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Exam Completed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
              <div className="text-5xl font-bold text-blue-600 mb-4">{score}%</div>
              <p className="text-gray-600">
                You answered {answers.filter((a, i) => a === exam.questions[i].correctAnswer).length} out of {exam.questions.length} questions correctly.
              </p>
            </div>
            
            <div className="flex justify-center mt-6 space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/exams')}
              >
                Back to Exams
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  setExamSubmitted(false);
                  setCurrentQuestionIndex(0);
                  setAnswers(new Array(exam.questions.length).fill(-1));
                }}
              >
                Retry Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>
            
            <RadioGroup
              value={answers[currentQuestionIndex].toString()}
              onValueChange={(value) => handleAnswer(parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 border rounded-lg p-4 transition-colors ${
                    answers[currentQuestionIndex] === index ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex === exam.questions.length - 1 ? (
            <Button
              variant="default"
              onClick={handleSubmitExam}
              disabled={answers.includes(-1)}
            >
              Submit Exam
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;

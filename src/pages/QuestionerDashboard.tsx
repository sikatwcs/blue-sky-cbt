import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Plus, Save, Trash, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage, saveQuestion, getQuestions } from "@/lib/supabase";
import { toast } from "sonner";

interface Question {
  id: string;
  type: string;
  subType?: string;
  question: string;
  image_url?: string;
  options: string[];
  correctAnswer: string;
  points: number;
  created_at?: string;
}

const QuestionerDashboard = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubType, setSelectedSubType] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: "",
    subType: "",
    question: "",
    options: ["", "", "", "", ""],
    correctAnswer: "",
    points: 5
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'questioner') {
      navigate('/questioner/login');
    } else {
      loadQuestions();
    }
  }, [navigate]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      toast.error("Gagal memuat soal");
    } finally {
      setIsLoading(false);
    }
  };

  const testTypes = [
    { value: "TKD_BUMN", label: "TKD BUMN" },
    { value: "AKHLAK_BUMN", label: "AKHLAK BUMN" },
    { value: "TWK_BUMN", label: "TWK BUMN" }
  ];

  const subTypes = {
    TKD_BUMN: [
      { value: "verbal_logical", label: "Tes Verbal Logical Reasoning" },
      { value: "number_sequence", label: "Tes Number Sequence" },
      { value: "word_classification", label: "Tes Word Classification" },
      { value: "diagram_reasoning", label: "Tes Diagram Reasoning" }
    ],
    AKHLAK_BUMN: [
      { value: "penilaian_diri", label: "Tes Penilaian Diri AKHLAK" }
    ],
    TWK_BUMN: [
      { value: "wawasan_kebangsaan", label: "Tes Wawasan Kebangsaan" }
    ]
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSelectedSubType("");
    setCurrentQuestion({
      id: "",
      type: value,
      subType: "",
      question: "",
      options: value === "AKHLAK_BUMN" ? ["", ""] : ["", "", "", "", ""],
      correctAnswer: "",
      points: 5
    });
  };

  const handleSubTypeChange = (value: string) => {
    setSelectedSubType(value);
    setCurrentQuestion(prev => ({
      ...prev,
      subType: value
    }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion(prev => ({
      ...prev,
      question: e.target.value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      correctAnswer: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Ukuran gambar maksimal 2MB");
        return;
      }

      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    if (currentQuestion.image_url) {
      setCurrentQuestion({ ...currentQuestion, image_url: undefined });
    }
  };

  const handleSaveQuestion = async () => {
    try {
      if (!currentQuestion.question || !currentQuestion.correctAnswer) {
        toast.error("Pertanyaan dan jawaban benar harus diisi");
        return;
      }

      setIsSaving(true);
      let imageUrl = currentQuestion.image_url;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
        image_url: imageUrl
      };

      await saveQuestion(newQuestion);
      setQuestions(prev => [newQuestion, ...prev]);

      // Reset form
      setCurrentQuestion({
        id: "",
        type: selectedType,
        subType: selectedSubType,
        question: "",
        options: selectedType === "AKHLAK_BUMN" ? ["", ""] : ["", "", "", "", ""],
        correctAnswer: "",
        points: 5
      });
      setSelectedImage(null);
      setPreviewUrl("");
      toast.success("Soal berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan soal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('loginTime');
    navigate('/questioner/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-2xl text-red-600">Jago</span>
              <span className="font-bold text-2xl">CPNS</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Buat Soal CBT BUMN
          </h1>

          {/* Form Pembuatan Soal */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Jenis Tes</Label>
                <Select value={selectedType} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis tes" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedType && (
                <div className="space-y-2">
                  <Label>Sub Jenis Tes</Label>
                  <Select value={selectedSubType} onValueChange={handleSubTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sub jenis tes" />
                    </SelectTrigger>
                    <SelectContent>
                      {subTypes[selectedType as keyof typeof subTypes].map(subType => (
                        <SelectItem key={subType.value} value={subType.value}>
                          {subType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Pertanyaan</Label>
              <Textarea
                placeholder="Masukkan pertanyaan..."
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                className="min-h-[100px]"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label>Gambar (Opsional)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Pilih Gambar
                </Label>
                {(previewUrl || currentQuestion.image_url) && (
                  <Button
                    variant="ghost"
                    onClick={handleRemoveImage}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Hapus Gambar
                  </Button>
                )}
              </div>
              {(previewUrl || currentQuestion.image_url) && (
                <div className="mt-4">
                  <img
                    src={previewUrl || currentQuestion.image_url}
                    alt="Preview"
                    className="max-w-md rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Pilihan Jawaban</Label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm font-medium w-8">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <Input
                    placeholder={`Masukkan pilihan ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Jawaban Benar</Label>
              <Select 
                value={currentQuestion.correctAnswer}
                onValueChange={handleCorrectAnswerChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jawaban benar" />
                </SelectTrigger>
                <SelectContent>
                  {currentQuestion.options.map((_, index) => (
                    <SelectItem 
                      key={index} 
                      value={String.fromCharCode(65 + index)}
                    >
                      {String.fromCharCode(65 + index)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSaveQuestion} 
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Soal
                </>
              )}
            </Button>
          </div>

          {/* Daftar Soal */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Memuat soal...</span>
            </div>
          ) : questions.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Daftar Soal ({questions.length})
              </h2>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div 
                    key={q.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <span className="font-medium">Soal {index + 1}</span>
                        <p className="text-gray-600">{q.question}</p>
                        {q.image_url && (
                          <img
                            src={q.image_url}
                            alt="Question"
                            className="max-w-md rounded-lg shadow-sm mt-2"
                          />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {q.options.map((option, optIndex) => (
                        <div 
                          key={optIndex}
                          className={`text-sm ${
                            String.fromCharCode(65 + optIndex) === q.correctAnswer
                              ? "text-green-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada soal yang dibuat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionerDashboard; 
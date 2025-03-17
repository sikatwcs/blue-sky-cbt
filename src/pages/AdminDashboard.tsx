import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Edit, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Question {
  id: string;
  type: string;
  sub_type: string;
  question: string;
  image_url?: string;
  options: string[];
  correct_answer: string;
  points: number;
  created_at: string;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  passing_score: number;
  is_active: boolean;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("questions");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "",
    sub_type: "",
    question: "",
    options: ["", "", "", "", ""],
    correct_answer: "",
    points: 5
  });

  // Exams state
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentExam, setCurrentExam] = useState<Partial<Exam>>({
    title: "",
    description: "",
    duration: 60,
    passing_score: 70,
    is_active: true
  });

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    email: "",
    full_name: "",
    role: "user"
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/admin/login');
    } else {
      loadData();
    }
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [questionsData, examsData, usersData] = await Promise.all([
        supabase.from('questions').select('*').order('created_at', { ascending: false }),
        supabase.from('exams').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false })
      ]);

      if (questionsData.data) setQuestions(questionsData.data);
      if (examsData.data) setExams(examsData.data);
      if (usersData.data) setUsers(usersData.data);
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  // Question handlers
  const handleSaveQuestion = async () => {
    try {
      setIsSaving(true);
      if (currentQuestion.id) {
        const { error } = await supabase
          .from('questions')
          .update(currentQuestion)
          .eq('id', currentQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('questions')
          .insert(currentQuestion);
        if (error) throw error;
      }
      toast.success("Soal berhasil disimpan");
      loadData();
      setCurrentQuestion({
        type: "",
        sub_type: "",
        question: "",
        options: ["", "", "", "", ""],
        correct_answer: "",
        points: 5
      });
    } catch (error) {
      toast.error("Gagal menyimpan soal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Soal berhasil dihapus");
      loadData();
    } catch (error) {
      toast.error("Gagal menghapus soal");
    }
  };

  // Exam handlers
  const handleSaveExam = async () => {
    try {
      setIsSaving(true);
      if (currentExam.id) {
        const { error } = await supabase
          .from('exams')
          .update(currentExam)
          .eq('id', currentExam.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('exams')
          .insert(currentExam);
        if (error) throw error;
      }
      toast.success("Ujian berhasil disimpan");
      loadData();
      setCurrentExam({
        title: "",
        description: "",
        duration: 60,
        passing_score: 70,
        is_active: true
      });
    } catch (error) {
      toast.error("Gagal menyimpan ujian");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Ujian berhasil dihapus");
      loadData();
    } catch (error) {
      toast.error("Gagal menghapus ujian");
    }
  };

  // User handlers
  const handleSaveUser = async () => {
    try {
      setIsSaving(true);
      if (currentUser.id) {
        const { error } = await supabase
          .from('users')
          .update(currentUser)
          .eq('id', currentUser.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('users')
          .insert(currentUser);
        if (error) throw error;
      }
      toast.success("Pengguna berhasil disimpan");
      loadData();
      setCurrentUser({
        email: "",
        full_name: "",
        role: "user"
      });
    } catch (error) {
      toast.error("Gagal menyimpan pengguna");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Pengguna berhasil dihapus");
      loadData();
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('loginTime');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="questions">Soal</TabsTrigger>
            <TabsTrigger value="exams">Ujian</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Daftar Soal</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Soal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {currentQuestion.id ? "Edit Soal" : "Tambah Soal"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Tipe Soal</Label>
                        <Select
                          value={currentQuestion.type}
                          onValueChange={(value) =>
                            setCurrentQuestion({ ...currentQuestion, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe soal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TKD_BUMN">TKD BUMN</SelectItem>
                            <SelectItem value="AKHLAK_BUMN">AKHLAK BUMN</SelectItem>
                            <SelectItem value="TWK_BUMN">TWK BUMN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Sub Tipe</Label>
                        <Select
                          value={currentQuestion.sub_type}
                          onValueChange={(value) =>
                            setCurrentQuestion({ ...currentQuestion, sub_type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih sub tipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verbal_logical">Verbal Logical</SelectItem>
                            <SelectItem value="number_sequence">Number Sequence</SelectItem>
                            <SelectItem value="word_classification">Word Classification</SelectItem>
                            <SelectItem value="diagram_reasoning">Diagram Reasoning</SelectItem>
                            <SelectItem value="penilaian_diri">Penilaian Diri</SelectItem>
                            <SelectItem value="wawasan_kebangsaan">Wawasan Kebangsaan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Pertanyaan</Label>
                        <Textarea
                          value={currentQuestion.question}
                          onChange={(e) =>
                            setCurrentQuestion({ ...currentQuestion, question: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Pilihan Jawaban</Label>
                        {currentQuestion.options?.map((option, index) => (
                          <Input
                            key={index}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(currentQuestion.options || [])];
                              newOptions[index] = e.target.value;
                              setCurrentQuestion({ ...currentQuestion, options: newOptions });
                            }}
                            className="mb-2"
                          />
                        ))}
                      </div>
                      <div>
                        <Label>Jawaban Benar</Label>
                        <Select
                          value={currentQuestion.correct_answer}
                          onValueChange={(value) =>
                            setCurrentQuestion({ ...currentQuestion, correct_answer: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jawaban benar" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentQuestion.options?.map((_, index) => (
                              <SelectItem key={index} value={String.fromCharCode(65 + index)}>
                                {String.fromCharCode(65 + index)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Poin</Label>
                        <Input
                          type="number"
                          value={currentQuestion.points}
                          onChange={(e) =>
                            setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })
                          }
                        />
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
                          "Simpan"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Sub Tipe</TableHead>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Poin</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.type}</TableCell>
                        <TableCell>{question.sub_type}</TableCell>
                        <TableCell>{question.question}</TableCell>
                        <TableCell>{question.points}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentQuestion(question)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Daftar Ujian</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Ujian
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {currentExam.id ? "Edit Ujian" : "Tambah Ujian"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Judul</Label>
                        <Input
                          value={currentExam.title}
                          onChange={(e) =>
                            setCurrentExam({ ...currentExam, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Deskripsi</Label>
                        <Textarea
                          value={currentExam.description}
                          onChange={(e) =>
                            setCurrentExam({ ...currentExam, description: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Durasi (menit)</Label>
                        <Input
                          type="number"
                          value={currentExam.duration}
                          onChange={(e) =>
                            setCurrentExam({ ...currentExam, duration: parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label>Nilai Minimum</Label>
                        <Input
                          type="number"
                          value={currentExam.passing_score}
                          onChange={(e) =>
                            setCurrentExam({ ...currentExam, passing_score: parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={currentExam.is_active ? "active" : "inactive"}
                          onValueChange={(value) =>
                            setCurrentExam({ ...currentExam, is_active: value === "active" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleSaveExam}
                        className="w-full"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Nilai Minimum</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.title}</TableCell>
                        <TableCell>{exam.duration} menit</TableCell>
                        <TableCell>{exam.passing_score}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              exam.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exam.is_active ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentExam(exam)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExam(exam.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Daftar Pengguna</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Pengguna
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {currentUser.id ? "Edit Pengguna" : "Tambah Pengguna"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={currentUser.email}
                          onChange={(e) =>
                            setCurrentUser({ ...currentUser, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Nama Lengkap</Label>
                        <Input
                          value={currentUser.full_name}
                          onChange={(e) =>
                            setCurrentUser({ ...currentUser, full_name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select
                          value={currentUser.role}
                          onValueChange={(value) =>
                            setCurrentUser({ ...currentUser, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="questioner">Questioner</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleSaveUser}
                        className="w-full"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "questioner"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard; 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk upload gambar
export const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('question-images')
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data: publicUrl } = supabase.storage
    .from('question-images')
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
};

// Fungsi untuk menyimpan soal
export const saveQuestion = async (question: any) => {
  const { data, error } = await supabase
    .from('questions')
    .insert(question)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

// Fungsi untuk mengambil semua soal
export const getQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}; 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rkeufelbokirtpzcseuo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZXVmZWxib2tpcnRwemNzZXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzc4NjMsImV4cCI6MjA1Nzc1Mzg2M30.bSVBdKG2VJNZgTEcVCd8AywX56LEpLgeVQ7Fb6QBmqw';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key are required');
}

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
// Configuración de Supabase
export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vrmjvnempqsnkiydsoxc.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWp2bmVtcHFzbmtpeWRzb3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODkyNjQsImV4cCI6MjA5MzE2NTI2NH0.tGxNamm7mTlrBsfjIbMecW7qeaDFsjszyHMDtt8LrBA',
};

// Configuración de API
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default {
  SUPABASE_CONFIG,
  API_CONFIG,
};

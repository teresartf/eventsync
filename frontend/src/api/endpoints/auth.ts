// src/api/auth.ts
import { api } from "../client";

interface RegisterData {
    nome: string;
    email: string;
    senha: string;
    role: "USER" | "ORGANIZER";
}

interface LoginData {
  email: string;
  senha: string;
}

export const cadastro = async (data: RegisterData) => {
    return api.post("/register", data); // envie **apenas** esses campos
}; 
  
export const login = async (email: string, password: string, data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

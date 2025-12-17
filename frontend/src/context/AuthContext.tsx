'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/api/client"; // seu axios configurado

interface User {
  id: string;
  nome: string;
  email: string;
  role: "USER" | "ORGANIZER";
}

interface LoginData {
  email: string;
  senha: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  role: "USER";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  cadastro: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Erro ao ler usuário do localStorage:", err);
        localStorage.removeItem("user"); // limpa se tiver dado ruim
      }
    }
    setLoading(false);
  }, []);
  

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { user: userData, token } = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
      router.push("/home");
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const cadastro = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Chama a rota correta do backend
      const res = await api.post('/auth/register', {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        role: "USER", // role fixa
      });
  
      // Se o backend já retorna token e usuário, pega do response
      const { access_token, user: userData } = res.data;
  
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
  
      router.push("/home"); // redireciona para home
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };  

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, cadastro, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

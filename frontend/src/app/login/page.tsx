'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Poppins } from "next/font/google";
import clsx from "clsx"; // Para classes condicionais (npm install clsx)

// Fonte Poppins
const poppins = Poppins({ subsets: ["latin"], weight: ["400","600","700"] });

export default function AuthPage() {
  const { login, cadastro } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [nome, setName] = useState('');
  const [senha, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<{ [key: string]: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!email || !senha || (!isLogin && !nome)) {
      setError('Preencha todos os campos');
      return;
    }
  
    try {
      if (isLogin) {
        await login({ email, senha: senha }); // ⚠ usar 'senha'
      } else {
        await cadastro({
          nome: nome,  // ⚠ usar 'nome'
          email,
          senha: senha, // ⚠ usar 'senha'
          role: "USER"     // role fixa
        });
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao processar");
      }
    }
  };  

  const handleFocus = (field: string) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field: string) => setFocused({ ...focused, [field]: false });

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-[#ffe6e0] font-sans ${poppins.className}`}>
      {/* Título e slogan */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-[#ff6b4d]">EventSync</h1>
        <p className="text-[#ff8c69] mt-2 text-lg">Conectando você aos eventos que importam</p>
      </div>

      <div className="w-full max-w-md p-6 rounded shadow-md bg-white">
        {/* Tabs */}
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 font-semibold rounded-t ${
              isLogin ? 'bg-[#ff8c69] text-white' : 'bg-[#ffe6e0] text-[#ff8c69]'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-t ${
              !isLogin ? 'bg-[#ff8c69] text-white' : 'bg-[#ffe6e0] text-[#ff8c69]'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Cadastro
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={e => setName(e.target.value)}
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
              className={clsx(
                "w-full p-2 border rounded placeholder-[#ff8c69] text-gray-800 transition-all",
                focused.name ? "border-[#ff6b4d] shadow-md" : "border-[#ffb299]"
              )}
            />
          )}
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            className={clsx(
              "w-full p-2 border rounded placeholder-[#ff8c69] text-gray-800 transition-all",
              focused.email ? "border-[#ff6b4d] shadow-md" : "border-[#ffb299]"
            )}
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
            className={clsx(
              "w-full p-2 border rounded placeholder-[#ff8c69] text-gray-800 transition-all",
              focused.password ? "border-[#ff6b4d] shadow-md" : "border-[#ffb299]"
            )}
          />

          {/* Erro animado */}
          {error && (
            <p className="text-red-500 animate-pulse font-semibold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-[#ff8c69] text-white font-semibold rounded hover:bg-[#ff6b4d] transition-colors"
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        {/* Toggle link */}
        <p className="text-center mt-4 text-[#ff8c69] cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
        </p>
      </div>
    </div>
  );
}
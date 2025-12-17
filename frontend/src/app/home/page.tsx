'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

interface Evento {
  id: string;
  titulo: string;
  status: 'Rascunho' | 'Inscrições Abertas' | 'Em Andamento' | 'Finalizado';
  descricao: string;
  dataInicio: string;
  dataFim: string;
  local: string;
}

export default function HomePage() {
  const { user, logout } = useAuth();

  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: '1',
      titulo: 'Workshop de React',
      status: 'Rascunho',
      descricao: 'Aprenda React do zero em 1 dia',
      dataInicio: '20/12/2025 • 10:00',
      dataFim: '20/12/2025 • 17:00',
      local: 'Online • Zoom',
    },
    {
      id: '2',
      titulo: 'Evento de Networking',
      status: 'Inscrições Abertas',
      descricao: 'Conecte-se com profissionais da área',
      dataInicio: '25/12/2025 • 18:00',
      dataFim: '25/12/2025 • 21:00',
      local: 'Rua Exemplo, 123',
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#FADADD]">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-[#F28B8B] tracking-tight">
            Event<span className="text-[#F6A6A6]">Sync</span>
        </h1>


        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Olá, {user?.nome} </span>
          <button
            onClick={logout}
            className="text-[#F28B8B] font-semibold hover:underline"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-[#444]">
            Seus Eventos
          </h2>

          <button
            onClick={() => setShowForm(true)}
            className="bg-[#F28B8B] text-white px-5 py-2.5 rounded-full font-medium shadow hover:opacity-90 transition"
          >
            + Novo Evento
          </button>
        </div>

        {/* LISTA DE EVENTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventos.map(e => (
            <div
              key={e.id}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-[#333] mb-1">
                {e.titulo}
              </h3>

              <p className="text-sm text-gray-600 mb-3">
                {e.descricao}
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>📅 {e.dataInicio} — {e.dataFim}</p>
                <p>📍 {e.local}</p>
              </div>

              <span
                className={clsx(
                  "inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold",
                  {
                    'bg-yellow-100 text-yellow-700': e.status === 'Rascunho',
                    'bg-green-100 text-green-700': e.status === 'Inscrições Abertas',
                    'bg-blue-100 text-blue-700': e.status === 'Em Andamento',
                    'bg-gray-200 text-gray-500': e.status === 'Finalizado',
                  }
                )}
              >
                {e.status}
              </span>

              {/* AÇÕES */}
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-xs rounded-full bg-[#FADADD] text-[#444] hover:bg-[#F6A6A6] hover:text-white transition">
                  Editar
                </button>
                <button className="px-3 py-1.5 text-xs rounded-full bg-[#FADADD] text-[#444] hover:bg-[#F6A6A6] hover:text-white transition">
                  Inscrições
                </button>
                <button className="px-3 py-1.5 text-xs rounded-full bg-[#FADADD] text-[#444] hover:bg-[#F6A6A6] hover:text-white transition">
                  Ver inscritos
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL MOCK */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-[#333]">
              Criar Evento
            </h3>

            <input
                className="border border-[#F6A6A6] rounded-lg p-3 
                            text-[#333] placeholder:text-[#999]
                            focus:outline-none focus:ring-2 focus:ring-[#F28B8B]"
                placeholder="Título do evento"
                />

                <input
                className="border border-[#F6A6A6] rounded-lg p-3 
                            text-[#333] placeholder:text-[#999]
                            focus:outline-none focus:ring-2 focus:ring-[#F28B8B]"
                placeholder="Descrição curta"
                />

                <input
                className="border border-[#F6A6A6] rounded-lg p-3 
                            text-[#333] placeholder:text-[#999]
                            focus:outline-none focus:ring-2 focus:ring-[#F28B8B]"
                placeholder="Local"
            />


            <div className="mt-6 flex justify-end gap-3">
            <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-full 
                            bg-[#FADADD] text-[#F28B8B] 
                            hover:bg-[#F6A6A6] hover:text-white 
                            transition font-medium"
                >
                Cancelar
            </button>

              <button className="px-4 py-2 rounded-full bg-[#F28B8B] text-white hover:opacity-90">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
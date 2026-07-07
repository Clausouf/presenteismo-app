'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// ⚠️ SUBSTITUA COM OS SEUS DADOS REAIS DO SUPABASE (Pegue no painel do Supabase -> Project Settings -> API)
const SUPABASE_URL = "https://vtbbucveqojbmdkuytuv.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_NEZye1H8fyRFurz1nMM-CQ_67SA8iWq";

export default function CriarAdmTemporario() {
  const [status, setStatus] = useState('');

  const rodarInjecao = async () => {
    setStatus('Processando criação...');
    
    // Inicializa o cliente direto aqui para não ter erro de importação
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase.auth.signUp({
      // Usando o truque da matrícula mascarada como e-mail
      email: '123456@sistema.local', 
      password: 'SenhaForte123!',
      options: {
        // Esses dados vão direto para o metadado que o seu banco de dados exige
        data: {
          matricula: '123456',
          nome: 'Administrador Inicial',
          perfil: 'admin', // Altere se o seu sistema usar outro nome de perfil
          status: 'ativo'
        }
      }
    });

    if (error) {
      setStatus(`❌ Erro: ${error.message}`);
    } else {
      setStatus(`✅ SUCESSO! Usuário criado com ID: ${data.user?.id}. Agora você já pode tentar logar com a matrícula 123456 e a senha SenhaForte123!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center space-y-6">
        <h1 className="text-2xl font-bold text-indigo-400">Injetor de Usuário Mestre</h1>
        <p className="text-gray-400 text-sm">
          Este botão vai criar uma conta com a matrícula <span className="text-white font-mono">123456</span> e senha <span className="text-white font-mono">SenhaForte123!</span> injetando os metadados corretos no banco.
        </p>
        
        <button 
          onClick={rodarInjecao}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg active:scale-95"
        >
          Injetar Usuário Administrador
        </button>

        {status && (
          <div className="p-4 bg-gray-950 rounded-xl text-sm border border-gray-800 font-mono text-left break-words">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

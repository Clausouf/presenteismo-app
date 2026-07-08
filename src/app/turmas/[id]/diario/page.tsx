'use client';

export const runtime = 'edge';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function DiarioPage() {
  const router = useRouter();
  const params = useParams();
  
  // Captura automaticamente o ID da turma digitado na URL (Ex: 241A)
  const turmaId = params?.id || 'Teste';

  const [relato, setRelato] = useState('');

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* MENU LATERAL */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2">
        <div className="mb-6 px-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Navegação</h2>
        </div>
        
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
            <span>📊 Dashboard</span>
          </Link>
          
          <Link href="/turmas" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
            <span>📝 Turmas</span>
          </Link>

          <Link href={`/turmas/${turmaId}/diario`} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-medium text-sm">
            <span>📔 Diário de presença</span>
          </Link>

          <Link href="/calendario" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
            <span>📅 Calendário</span>
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* TOPO */}
        <div className="flex justify-between items-start w-full">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Diário de Bordo</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Acompanhamento operacional da Turma: <span className="font-semibold text-blue-600 dark:text-blue-400">#{turmaId}</span></p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            Sair do Sistema
          </button>
        </div>

        {/* FORMULÁRIO DO DIÁRIO */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Registrar Relato Diário</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descreva as ocorrências, faltas ou observações de hoje:</label>
            <textarea 
              rows={5}
              value={relato}
              onChange={(e) => setRelato(e.target.value)}
              placeholder="Ex: Alunos focados na dinâmica, 2 ausências na operação por motivo médico..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm text-sm">
            Salvar Ocorrência
          </button>
        </div>

      </main>
    </div>
  );
}

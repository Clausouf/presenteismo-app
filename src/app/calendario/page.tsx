'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CalendarioPage() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  // Eventos simulados de treinamento
  const eventos = [
    { id: 1, data: '13/07/2026', turma: 'Turma #241A', atividade: 'Treinamento de Integração', horario: '09:00 - 12:00' },
    { id: 2, data: '15/07/2026', turma: 'Turma #239B', atividade: 'Avaliação de Qualidade', horario: '14:00 - 16:00' },
  ];

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

          <Link href="/turmas/teste/diario" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
            <span>📔 Diário de presença</span>
          </Link>

          <Link href="/calendario" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-medium text-sm">
            <span>📅 Calendário</span>
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* TOPO */}
        <div className="flex justify-between items-start w-full">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendário de Treinamentos</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Cronograma de início de turmas e eventos críticos de T&D.</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            Sair do Sistema
          </button>
        </div>

        {/* LISTA DE COMPROMISSOS */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Próximos Eventos</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {eventos.map((evento) => (
              <div key={evento.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 mb-2">
                    📅 {evento.data}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{evento.atividade}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">🎯 {evento.turma}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex items-center">
                  ⏰ {evento.horario}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

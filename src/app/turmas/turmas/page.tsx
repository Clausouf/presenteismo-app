'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TurmasPage() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  // Dados simulados para a tabela
  const turmas = [
    { id: '241A', nome: 'Turma #241A', operacao: 'Operação Retenção', clientes: 'Clientes Claro', alunos: 15 },
    { id: '239B', nome: 'Turma #239B', operacao: 'Dias de Alô', clientes: 'Treinamento Inicial', alunos: 22 }
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
          
          <Link href="/turmas" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-medium text-sm">
            <span>📝 Turmas</span>
          </Link>

          <Link href="/turmas/teste/diario" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestão de Turmas</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie as turmas ativas, alunos e acesse o diário de bordo.</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            Sair do Sistema
          </button>
        </div>

        {/* TABELA DE TURMAS */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Turma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Operação / Contexto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Qtd. Alunos</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {turmas.map((turma) => (
                <tr key={turma.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                    {turma.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <span className="block font-medium text-slate-700 dark:text-slate-300">{turma.operacao}</span>
                    <span className="text-xs text-slate-400">{turma.clientes}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {turma.alunos} alunos
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/turmas/${turma.id}/diario`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Abrir Diário ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

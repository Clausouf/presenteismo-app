'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- ADICIONE APENAS ESTA LINHA AQUI!
import { BarChart3, Users, ClipboardList, Calendar, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut(); // Avisa o Supabase que o usuário deslogou
    router.push('/');             // Redireciona de volta para a tela de login (raiz do site)
  }
  const [metrics, setMetrics] = useState({
    turmasAndamento: 0,
    turmasFinalizadas: 0,
    totalAlunos: 0,
    absDiario: 0.00,
    absGeral: 0.00,
    turnoverGeral: 0.00
  });
  const [limites, setLimites] = useState({ aceitavel: 3, alerta: 5 });

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Buscar parâmetros dinâmicos de limites para alertas visuais
      const { data: paramData } = await supabase.from('parametros_sistema').select('*').single();
      if (paramData) {
        setLimites({ aceitavel: paramData.abs_limite_aceitavel, alerta: paramData.abs_limite_alerta });
      }

      // 2. Agregações estatísticas simulando volumetria em tempo real
      const { count: andamento } = await supabase.from('turmas').select('*', { count: 'exact', head: true }).eq('status', 'Em Andamento');
      const { count: finalizadas } = await supabase.from('turmas').select('*', { count: 'exact', head: true }).eq('status', 'Finalizada');
      const { count: alunos } = await supabase.from('colaboradores').select('*', { count: 'exact', head: true }).eq('status', 'Ativo');

      // 3. Cálculo matemático direto das fórmulas de ABS e Turnover
      setMetrics({
        turmasAndamento: andamento || 0,
        turmasFinalizadas: finalizadas || 0,
        totalAlunos: alunos || 0,
        absDiario: 2.45,  // Mock dos cálculos agregados reativos baseados no diário
        absGeral: 4.12,
        turnoverGeral: 1.89
      });
    }

    loadDashboardData();
  }, []);

  const getAbsBadgeColor = (val: number) => {
    if (val <= limites.aceitavel) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200';
    if (val <= limites.alerta) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200';
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* MENU LATERAL DE ABAS */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2">
        <div className="mb-6 px-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Navegação</h2>
        </div>
        
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-medium text-sm">
            <span>📊 Dashboard</span>
          </Link>
          
          <Link href="/cadastro" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
            <span>📝 Cadastros / Turmas</span>
          </Link>

          <Link href="/turmas/teste/diario" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
            <span>📔 Diário de Bordo</span>
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL (DASHBOARD) */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* TOPO COM TÍTULO E BOTÃO DE SAIR */}
        <div className="flex justify-between items-start w-full">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Indicadores Gerenciais</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Acompanhamento operacional de T&D e R&S em tempo real.</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            Sair do Sistema
          </button>
        </div>

        {/* CARDS INDICADORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Turmas em Andamento</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.turmasAndamento}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Alunos em Treinamento</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.totalAlunos}</h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm flex items-center justify-between ${getAbsBadgeColor(metrics.absGeral)}`}>
            <div>
              <p className="text-sm font-medium opacity-80">Absenteísmo (ABS) Geral</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.absGeral.toFixed(2)}%</h3>
            </div>
            <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Turnover Geral</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.turnoverGeral.toFixed(2)}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* CONTAINER DO MEIO: GRÁFICOS & CALENDÁRIO ACERCA DAS OPERAÇÕES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Visão de ABS por Operação</h2>
            <div className="h-64 flex items-end gap-4 pt-6 border-b border-slate-200 dark:border-slate-700 px-4">
              {/* Mockup de barras Tailwind simulando dados em escala */}
              <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full bg-blue-500 rounded-t-lg transition-all" style={{ height: '40%' }}></div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate w-16 text-center">SAC</span>
              </div>
              <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full bg-rose-500 rounded-t-lg transition-all" style={{ height: '85%' }}></div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate w-16 text-center">Vendas</span>
              </div>
              <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full bg-amber-500 rounded-t-lg transition-all" style={{ height: '60%' }}></div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate w-16 text-center">Retenção</span>
              </div>
            </div>
          </div>

          {/* CALENDÁRIO LATERAL OPERACIONAL */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Eventos Críticos</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Início Turma #241A</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Operação Retenção - Clientes Claro</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                <CheckCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dias de Alô - Turma #239B</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Início do acompanhamento em tempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

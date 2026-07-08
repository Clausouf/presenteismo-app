'use client';

export const runtime = 'edge';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface Turma {
  numero_turma: string;
  nome_operacao: string;
  instrutor_analista_matricula: string;
  data_inicio: string;
  data_primeiro_alo: string;
  data_fim: string;
  dias_treinamento: number;
  status: string;
}

interface Operacao {
  nome: string;
}

interface Responsavel {
  matricula: string;
  nome: string;
  cargo: string;
}

export default function TurmasPage() {
  const router = useRouter();
  
  // Estados para dados do banco
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário de Nova Turma
  const [numeroTurma, setNumeroTurma] = useState('');
  const [operacaoSelecionada, setOperacaoSelecionada] = useState('');
  const [responsavelSelecionado, setResponsavelSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataPrimeiroAlo, setDataPrimeiroAlo] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [diasTreinamento, setDiasTreinamento] = useState('');
  const [statusTurma, setStatusTurma] = useState('Em andamento');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      
      // Puxa as tabelas necessárias
      const { data: dT, error: eT } = await supabase.from('turmas').select('*');
      const { data: dO, error: eO } = await supabase.from('lista_operacoes').select('nome');
      const { data: dR, error: eR } = await supabase.from('instrutor_analista').select('matricula, nome, cargo');

      if (eT || eO || eR) throw eT || eO || eR;

      setTurmas(dT || []);
      setOperacoes(dO || []);
      setResponsaveis(dR || []);

      // Define os selects padrão iniciais se houver dados
      if (dO && dO.length > 0) setOperacaoSelecionada(dO[0].nome);
      if (dR && dR.length > 0) setResponsavelSelecionado(dR[0].matricula);

    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarTurma(e: React.FormEvent) {
    e.preventDefault();
    if (!numeroTurma || !operacaoSelecionada || !responsavelSelecionado) {
      return alert('Por favor, preencha o número da turma, operação e responsável!');
    }

    try {
      const { error } = await supabase.from('turmas').insert([{
        numero_turma: numeroTurma.trim().toUpperCase(),
        nome_operacao: operacaoSelecionada,
        instrutor_analista_matricula: responsavelSelecionado,
        data_inicio: dataInicio || null,
        data_primeiro_alo: dataPrimeiroAlo || null,
        data_fim: dataFim || null,
        dias_treinamento: diasTreinamento ? parseInt(diasTreinamento) : null,
        status: statusTurma
      }]);

      if (error) throw error;

      alert('Turma salva com sucesso!');
      setNumeroTurma('');
      setDiasTreinamento('');
      carregarDados();
    } catch (error: any) {
      alert('Erro ao salvar turma: ' + error.message);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* MENU LATERAL */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 px-2">Navegação</h2>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 text-sm font-medium">
            <span>📊 Dashboard</span>
          </Link>
          <Link href="/turmas" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 text-sm font-medium">
            <span>📝 Cadastros / Turmas</span>
          </Link>
          <Link href="/colaboradores" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 text-sm font-medium">
            <span>👥 Colaboradores</span>
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Turmas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Abra novas turmas e defina cronogramas operacionais.</p>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold mb-4">➕ Cadastrar Nova Turma</h2>
          <form onSubmit={handleCriarTurma} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">NÚMERO DA TURMA</label>
              <input type="text" placeholder="Ex: 241A" value={numeroTurma} onChange={e => setNumeroTurma(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">NOME DA OPERAÇÃO</label>
              <select value={operacaoSelecionada} onChange={e => setOperacaoSelecionada(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                {operacoes.map(op => <option key={op.nome} value={op.nome}>{op.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ANALISTA / INSTRUTOR</label>
              <select value={responsavelSelecionado} onChange={e => setResponsavelSelecionado(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                {responsaveis.map(res => <option key={res.matricula} value={res.matricula}>{res.nome} ({res.cargo})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">STATUS</label>
              <select value={statusTurma} onChange={e => setStatusTurma(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">DATA INÍCIO</label>
              <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">PRIMEIRO ALÔ</label>
              <input type="date" value={dataPrimeiroAlo} onChange={e => setDataPrimeiroAlo(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">DATA FIM</label>
              <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">DIAS DE TREINAMENTO</label>
              <input type="number" placeholder="Ex: 15" value={diasTreinamento} onChange={e => setDiasTreinamento(e.target.value)} className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div className="md:col-span-4 mt-2">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Salvar Turma</button>
            </div>
          </form>
        </div>

        {/* TABELA */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500">Carregando turmas...</div> : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Turma</th>
                  <th className="py-3 px-6">Operação</th>
                  <th className="py-3 px-6">Cronograma</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {turmas.map(t => (
                  <tr key={t.numero_turma} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-4 px-6 font-bold text-blue-600">#{t.numero_turma}</td>
                    <td className="py-4 px-6 font-medium">{t.nome_operacao}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      📅 Início: {t.data_inicio || '-'} | 📞 Alô: {t.data_primeiro_alo || '-'} | 🏁 Fim: {t.data_fim || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.status === 'Em andamento' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{t.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/turmas/${t.numero_turma}/diario`} className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">📔 Abrir Diário</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

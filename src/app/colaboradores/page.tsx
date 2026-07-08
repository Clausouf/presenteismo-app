'use client';

export const runtime = 'edge';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface Colaborador {
  id: number;
  matricula: string;
  nome: string;
  cpf: string;
  data_admissao: string;
  jornada: string;
  grupo_30h: string;
  nome_operacao: string;
  status: string;
  numero_turma: string;
}

interface Turma {
  numero_turma: string;
}

interface Operacao {
  nome: string;
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [jornada, setJornada] = useState('');
  const [grupo30h, setGrupo30h] = useState('Não');
  const [operacaoSelecionada, setOperacaoSelecionada] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [statusColaborador, setStatusColaborador] = useState('Ativo');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const { data: dC } = await supabase.from('colaboradores').select('*');
      const { data: dT } = await supabase.from('turmas').select('numero_turma');
      const { data: dO } = await supabase.from('lista_operacoes').select('nome');

      setColaboradores(dC || []);
      setTurmas(dT || []);
      setOperacoes(dO || []);

      if (dO && dO.length > 0) setOperacaoSelecionada(dO[0].nome);
      if (dT && dT.length > 0) setTurmaSelecionada(dT[0].numero_turma);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarColaborador(e: React.FormEvent) {
    e.preventDefault();
    if (!matricula || !nome) return alert('Matrícula e Nome são obrigatórios!');

    try {
      const { error } = await supabase.from('colaboradores').insert([{
        matricula: matricula.trim(),
        nome: nome.trim(),
        cpf: cpf.trim(),
        data_admissao: dataAdmissao || null,
        jornada: jornada.trim(),
        grupo_30h: grupo30h,
        nome_operacao: operacaoSelecionada,
        status: statusColaborador,
        numero_turma: turmaSelecionada || null
      }]);

      if (error) throw error;

      alert('Colaborador cadastrado com sucesso!');
      setMatricula(''); setNome(''); setCpf(''); setJornada('');
      carregarDados();
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* MENU LATERAL */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 px-2">Navegação</h2>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 text-sm font-medium">📊 Dashboard</Link>
          <Link href="/turmas" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 text-sm font-medium">📝 Cadastros / Turmas</Link>
          <Link href="/colaboradores" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 text-sm font-medium">👥 Colaboradores</Link>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Ficha de Colaboradores</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Cadastro funcional de operadores e vinculação de turmas.</p>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold mb-4">➕ Novo Colaborador</h2>
          <form onSubmit={handleCriarColaborador} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} className="text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700" />
            <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} className="text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700" />
            <input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} className="text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700" />
            
            <div>
              <label className="block text-xs text-slate-400 mb-0.5">Admissão</label>
              <input type="date" value={dataAdmissao} onChange={e => setDataAdmissao(e.target.value)} className="w-full text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700" />
            </div>
            <input type="text" placeholder="Jornada (Ex: 6x1 Tarde)" value={jornada} onChange={e => setJornada(e.target.value)} className="text-sm p-2 mt-4 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700" />
            
            <div>
              <label className="block text-xs text-slate-400 mb-0.5">Grupo 30h?</label>
              <select value={grupo30h} onChange={e => setGrupo30h(e.target.value)} className="w-full text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>

            <select value={operacaoSelecionada} onChange={e => setOperacaoSelecionada(e.target.value)} className="text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700">
              {operacoes.map(o => <option key={o.nome} value={o.nome}>{o.nome}</option>)}
            </select>

            <select value={turmaSelecionada} onChange={e => setTurmaSelecionada(e.target.value)} className="text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700">
              <option value="">Sem Turma / Backoffice</option>
              {turmas.map(t => <option key={t.numero_turma} value={t.numero_turma}>Turma: {t.numero_turma}</option>)}
            </select>

            <select value={statusColaborador} onChange={e => setStatusColaborador(e.target.value)} className="text-sm p-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <button type="submit" className="md:col-span-3 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium shadow-sm mt-2">Salvar Colaborador</button>
          </form>
        </div>

        {/* LISTAGEM */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-4">
          {loading ? <p>Buscando lista...</p> : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {colaboradores.map(c => (
                <li key={c.id} className="py-3 flex justify-between text-sm">
                  <div>
                    <span className="font-bold">[{c.matricula}]</span> {c.nome} 
                    <span className="text-xs ml-3 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">🏢 {c.nome_operacao}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Turma: <span className="text-blue-500 font-semibold">{c.numero_turma || 'Nenhuma'}</span> | Status: {c.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

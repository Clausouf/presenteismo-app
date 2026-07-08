'use client';

export const runtime = 'edge';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovaTurmaPage() {
  const router = useRouter();
  const [dadosTurma, setDadosTurma] = useState({ numero: '', operacao: '', instrutor: '', data: '' });
  const [listaOperadores, setListaOperadores] = useState('');

  async function salvarTudo() {
    try {
      // 1. Salvar a Turma
      const { error: errorTurma } = await supabase.from('turmas').insert([{
        numero_turma: dadosTurma.numero,
        nome_operacao: dadosTurma.operacao,
        instrutor_analista_matricula: dadosTurma.instrutor
      }]);
      if (errorTurma) throw errorTurma;

      // 2. Processar e salvar Operadores vinculados a esta Turma
      const linhas = listaOperadores.split('\n').filter(l => l.trim() !== '');
      const operadores = linhas.map(linha => {
        const [matricula, nome] = linha.split('\t');
        return { matricula, nome, numero_turma: dadosTurma.numero, nome_operacao: dadosTurma.operacao };
      });

      const { error: errorOps } = await supabase.from('colaboradores').insert(operadores);
      if (errorOps) throw errorOps;

      alert('Turma e equipe cadastradas com sucesso!');
      router.push('/turmas');
    } catch (e: any) {
      alert('Erro ao salvar: ' + e.message);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Abrir Nova Turma com Equipe</h1>
      
      {/* Bloco da Turma */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
        <input placeholder="Número da Turma" className="p-2 border rounded" onChange={e => setDadosTurma({...dadosTurma, numero: e.target.value})} />
        <input placeholder="Operação" className="p-2 border rounded" onChange={e => setDadosTurma({...dadosTurma, operacao: e.target.value})} />
      </div>

      {/* Bloco dos Operadores */}
      <div className="space-y-2">
        <label className="text-sm font-bold">Colar Equipe (Matrícula + Nome)</label>
        <textarea className="w-full h-40 p-4 border rounded" onChange={e => setListaOperadores(e.target.value)} />
      </div>

      <button onClick={salvarTudo} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">
        Salvar Turma e Vincular Equipe
      </button>
    </div>
  );
}

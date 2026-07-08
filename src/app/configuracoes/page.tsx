'use client';

export const runtime = 'edge';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function ConfiguracoesPage() {
  const [novaOperacao, setNovaOperacao] = useState('');
  const [novoInstrutor, setNovoInstrutor] = useState({ matricula: '', nome: '', cargo: 'Instrutor', operacao: '' });

  async function addOperacao(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('lista_operacoes').insert([{ nome: novaOperacao }]);
    alert('Operação adicionada!');
    setNovaOperacao('');
  }

  async function addInstrutor(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('instrutor_analista').insert([{ 
      matricula: novoInstrutor.matricula, 
      nome: novoInstrutor.nome, 
      cargo: novoInstrutor.cargo,
      nome_operacao: novoInstrutor.operacao 
    }]);
    alert('Instrutor/Analista adicionado!');
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={addOperacao} className="p-4 border rounded-lg space-y-3">
          <h2 className="font-bold">Nova Operação</h2>
          <input className="w-full border p-2 rounded" placeholder="Nome da Operação" value={novaOperacao} onChange={e => setNovaOperacao(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
        </form>

        <form onSubmit={addInstrutor} className="p-4 border rounded-lg space-y-3">
          <h2 className="font-bold">Novo Instrutor/Analista</h2>
          <input className="w-full border p-2 rounded" placeholder="Matrícula" onChange={e => setNovoInstrutor({...novoInstrutor, matricula: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="Nome" onChange={e => setNovoInstrutor({...novoInstrutor, nome: e.target.value})} />
          <select className="w-full border p-2 rounded" onChange={e => setNovoInstrutor({...novoInstrutor, cargo: e.target.value})}>
            <option>Instrutor</option>
            <option>Analista</option>
          </select>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded">Salvar</button>
        </form>
      </div>
      <Link href="/turmas" className="text-blue-500 underline">Voltar para Turmas</Link>
    </div>
  );
}

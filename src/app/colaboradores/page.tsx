'use client';

export const runtime = 'edge';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function ColaboradoresPage() {
  const [loading, setLoading] = useState(false);
  const [turmas, setTurmas] = useState<any[]>([]);
  // O estado abaixo vai receber o texto colado do Excel
  const [bulkData, setBulkData] = useState('');

  useEffect(() => {
    supabase.from('turmas').select('numero_turma').then(({ data }) => setTurmas(data || []));
  }, []);

  async function handleSalvarEmLote() {
    if (!bulkData.trim()) return alert('Cole os dados primeiro!');
    setLoading(true);

    try {
      // Divide o texto por linhas
      const linhas = bulkData.split('\n').filter(l => l.trim() !== '');
      
      const novosColaboradores = linhas.map(linha => {
        // Assume o formato colado do Excel: Matricula \t Nome \t CPF \t Jornada
        const [matricula, nome, cpf, jornada] = linha.split('\t');
        return {
          matricula: matricula?.trim(),
          nome: nome?.trim(),
          cpf: cpf?.trim() || null,
          jornada: jornada?.trim() || '6x1',
          grupo_30h: 'Não',
          status: 'Ativo'
        };
      });

      const { error } = await supabase.from('colaboradores').insert(novosColaboradores);
      if (error) throw error;

      alert('Colaboradores importados com sucesso!');
      setBulkData('');
    } catch (error: any) {
      alert('Erro na importação: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Cadastro em Lote (Copiar e Colar)</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <p className="text-sm text-slate-600">
          Copie as linhas da sua planilha (Matrícula, Nome, CPF, Jornada) e cole abaixo:
        </p>
        
        <textarea 
          className="w-full h-48 p-4 border rounded-lg font-mono text-xs"
          placeholder="Ex: 12345	João Silva	000.000.000-00	6x1"
          value={bulkData}
          onChange={e => setBulkData(e.target.value)}
        />
        
        <button 
          onClick={handleSalvarEmLote}
          disabled={loading}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          {loading ? 'Salvando...' : 'Salvar Lista de Operadores'}
        </button>
      </div>

      <Link href="/turmas" className="text-blue-500 underline">Voltar</Link>
    </div>
  );
}

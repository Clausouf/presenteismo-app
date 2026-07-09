'use client';

export const runtime = 'edge';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function DiarioBordo({ params }: { params: { numero_turma: string } }) {
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega os colaboradores da turma específica
  useEffect(() => {
    async function carregarDados() {
      const { data } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('numero_turma', params.numero_turma);
      
      setColaboradores(data || []);
      setLoading(false);
    }
    carregarDados();
  }, [params.numero_turma]);

  // Função para salvar a presença
  async function registrarStatus(colaboradorId: number, status: string) {
    try {
      const { error } = await supabase.from('diario_presenca').insert([{
        colaborador_id: colaboradorId,
        numero_turma: params.numero_turma,
        status: status,
        data_registro: new Date().toISOString().split('T')[0]
      }]);

      if (error) throw error;
      alert(`Status ${status} registrado!`);
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    }
  }

  if (loading) return <div className="p-8">Carregando turma...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Diário de Bordo - Turma {params.numero_turma}</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2">Matrícula</th>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Ações (Registrar Hoje)</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="border p-2">{c.matricula}</td>
                <td className="border p-2">{c.nome}</td>
                <td className="border p-2 flex gap-2">
                  <button onClick={() => registrarStatus(c.id, 'P')} className="bg-green-500 text-white px-2 py-1 rounded">P</button>
                  <button onClick={() => registrarStatus(c.id, 'F')} className="bg-red-500 text-white px-2 py-1 rounded">F</button>
                  <button onClick={() => registrarStatus(c.id, 'AT')} className="bg-yellow-500 text-white px-2 py-1 rounded">AT</button>
                  <button onClick={() => registrarStatus(c.id, 'FI')} className="bg-blue-500 text-white px-2 py-1 rounded">FI</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

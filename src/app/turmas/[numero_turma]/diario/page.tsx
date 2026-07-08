'use client';
export const runtime = 'edge';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function DiarioBordo({ params }: { params: { numero_turma: string } }) {
  const [colaboradores, setColaboradores] = useState<any[]>([]);

  useEffect(() => {
    carregarColaboradores();
  }, [params.numero_turma]);

  async function carregarColaboradores() {
    const { data } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('numero_turma', params.numero_turma);
    setColaboradores(data || []);
  }

  async function registrarStatus(colaboradorId: number, status: string) {
    await supabase.from('diario_presenca').insert([{
      colaborador_id: colaboradorId,
      presenca: status
    }]);
    alert('Registro salvo!');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Diário de Bordo: Turma {params.numero_turma}</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nome</th>
            <th className="py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map(c => (
            <tr key={c.id} className="border-b">
              <td className="py-3">{c.nome}</td>
              <td className="py-3 space-x-2">
                <button onClick={() => registrarStatus(c.id, 'Presente')} className="bg-green-100 p-1 rounded">Presente</button>
                <button onClick={() => registrarStatus(c.id, 'Falta')} className="bg-red-100 p-1 rounded">Falta</button>
                <button onClick={() => registrarStatus(c.id, 'Justificado')} className="bg-yellow-100 p-1 rounded">Atestado</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

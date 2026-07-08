'use client';
export const runtime = 'edge';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function DiarioBordo({ params }: { params: { numero_turma: string } }) {
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  // Simulando dias do cronograma da turma (você pode buscar isso da tabela 'turmas')
  const diasTreinamento = ['04/05', '05/05', '06/05', '07/05', '08/05'];

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const { data } = await supabase
      .from('colaboradores')
      .select('*, diario_presenca(*)') // Traz os registros de presença junto
      .eq('numero_turma', params.numero_turma);
    setColaboradores(data || []);
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">Matrícula</th>
            <th className="border p-2">Nome</th>
            {diasTreinamento.map(dia => <th key={dia} className="border p-2">{dia}</th>)}
          </tr>
        </thead>
        <tbody>
          {colaboradores.map(c => (
            <tr key={c.matricula}>
              <td className="border p-2">{c.matricula}</td>
              <td className="border p-2">{c.nome}</td>
              {diasTreinamento.map(dia => (
                <td key={dia} className="border p-2 text-center">
                  {/* Seletor de status para cada dia */}
                  <select className="bg-transparent font-bold">
                    <option value="P">P</option>
                    <option value="F">F</option>
                    <option value="AT">AT</option>
                    <option value="FI">FI</option>
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Rodapé de Cálculo (ABS) */}
      <div className="mt-8 p-4 bg-slate-50 border rounded">
        <h3 className="font-bold">Indicadores (Dashboard)</h3>
        <p>ABS Integração: { /* Aqui entra a fórmula: (Soma Faltas / Total) * 100 */ }</p>
      </div>
    </div>
  );
}

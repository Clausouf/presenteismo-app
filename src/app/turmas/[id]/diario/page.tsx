'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ColaboradorRow {
  id: string;
  matricula: string;
  nome: string;
  status: string;
}

export default function DiarioChamadaMatrix({ params }: { params: { id: string } }) {
  const [colaboradores, setColaboradores] = useState<ColaboradorRow[]>([]);
  const [datasDoMes, setDatasDoMes] = useState<string[]>([]);
  const [presencas, setPresencas] = useState<Record<string, string>>({}); // Chave: 'colaboradorId_data' -> Valor: tipo_registro

  useEffect(() => {
    async function loadDiarioData() {
      // Carrega os colaboradores vinculados à turma
      const { data: colabs } = await supabase.from('colaboradores').select('id, matricula, nome, status').eq('turma_id', params.id);
      if (colabs) setColaboradores(colabs);

      // Gera array de datas fictícias representando o range do treinamento para renderizar a matriz
      const diasSimulados = ['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-06', '2026-07-07'];
      setDatasDoMes(diasSimulados);
    }
    loadDiarioData();
  }, [params.id]);

  const handleStatusChange = async (colaboradorId: string, dataReg: string, novoStatus: string) => {
    const key = `${colaboradorId}_${dataReg}`;
    setPresencas(prev => ({ ...prev, [key]: novoStatus }));

    // Persistência reativa no Supabase via Upsert atômico
    await supabase.from('diario_presenca').upsert({
      colaborador_id: colaboradorId,
      data_registro: dataReg,
      tipo_registro: novoStatus as any
    }, { onConflict: 'colaborador_id, data_registro' });
  };

  return (
    <div className="p-6 max-w-full overflow-x-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Diário Operacional Prático</h1>
        <p className="text-slate-500 text-sm">Altere os status da célula para recalcular o ABS instantaneamente.</p>
      </div>

      <table className="w-full text-left border-collapse bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border">
        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs uppercase font-semibold">
          <tr>
            <th className="p-4 border-b whitespace-nowrap min-w-[240px]">Colaborador</th>
            {datasDoMes.map(d => (
              <th key={d} className="p-4 border-b text-center whitespace-nowrap">
                {d.split('-').reverse().slice(0,2).join('/')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {colaboradores.map(c => (
            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-medium text-slate-900 dark:text-white">
                <div>{c.nome}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{c.matricula}</div>
              </td>
              {datasDoMes.map(d => {
                const celulaKey = `${c.id}_${d}`;
                const valorAtual = presencas[celulaKey] || 'Presença';

                return (
                  <td key={d} className="p-2 border-l text-center">
                    <select
                      value={valorAtual}
                      onChange={(e) => handleStatusChange(c.id, d, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-md border focus:outline-none ${
                        valorAtual === 'Presença' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        valorAtual === 'Falta Injustificada' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="Presença">PRE</option>
                      <option value="Falta Injustificada">FAL</option>
                      <option value="Atestado">ATE</option>
                      <option value="Folga">FOL</option>
                      <option value="Desligamento pela Empresa">DES</option>
                    </select>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
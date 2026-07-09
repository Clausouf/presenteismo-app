'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export default function CalendarioPage() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const hoje = new Date();
  const diasDoMes = eachDayOfInterval({
    start: startOfMonth(hoje),
    end: endOfMonth(hoje)
  });

  useEffect(() => {
    async function carregarTurmas() {
      const { data } = await supabase.from('turmas').select('*');
      setTurmas(data || []);
    }
    carregarTurmas();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Calendário de Turmas - {format(hoje, 'MMMM/yyyy')}</h1>
      
      <div className="grid grid-cols-7 gap-1 border-t border-l">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
          <div key={dia} className="p-2 font-bold text-center bg-slate-100 border-r border-b">{dia}</div>
        ))}

        {diasDoMes.map(dia => (
          <div key={dia.toString()} className="h-24 border-r border-b p-1 bg-white">
            <span className="text-xs text-slate-500">{format(dia, 'd')}</span>
            
            {/* Filtra turmas que ocorrem neste dia */}
            {turmas.filter(t => isSameDay(new Date(t.data_inicio || '2026-07-01'), dia)).map(t => (
              <div key={t.id} className="mt-1 p-1 bg-blue-100 text-[10px] rounded truncate cursor-pointer hover:bg-blue-200">
                Turma {t.numero_turma}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

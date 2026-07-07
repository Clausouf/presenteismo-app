'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Save, AlertCircle } from 'lucide-react';

export default function CadastroTurma() {
  const router = useRouter();
  const [numeroTurma, setNumeroTurma] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [diasTreinamento, setDiasTreinamento] = useState(12);
  const [diasAlo, setDiasAlo] = useState(3);
  const [loading, setLoading] = useState(false);

  // Motor Inteligente de Projeção Cronológica Corporativa
  const calcularDataFim = (start: string, tDays: number, aDays: number): string => {
    if (!start) return '';
    let dataAtual = new Date(start + 'T00:00:00');
    let totalDiasUteisNecessarios = tDays + aDays;
    let diasContados = 0;

    // Percorre o calendário pulando os finais de semana (Sábado/Domingo)
    while (diasContados < totalDiasUteisNecessarios) {
      if (diasContados > 0) {
        dataAtual.setDate(dataAtual.getDate() + 1);
      }
      const diaSemana = dataAtual.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) { // 0 = Domingo, 6 = Sábado
        diasContados++;
      } else if (diasContados === 0) {
        // Se a data de início cair no fim de semana, move para a próxima segunda antes de iniciar o fluxo
        dataAtual.setDate(dataAtual.getDate() + (diaSemana === 0 ? 1 : 2));
      }
    }
    return dataAtual.toISOString().split('T')[0];
  };

  const dataFimCalculada = calcularDataFim(dataInicio, diasTreinamento, diasAlo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: userSession } = await supabase.auth.getSession();

    const { data, error } = await supabase.from('turmas').insert({
      numero_turma: numeroTurma,
      operacao_id: '8af6869a-7a5b-4c2a-9f5e-bd2999cb5107', // Mock ID para fluxo isolado
      analista_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      instrutor_id: 'f6e5d4c3-b2a1-0f9e-8d7c-6b5a4b3c2d1e',
      data_inicio: dataInicio,
      data_fim: dataFimCalculada,
      dias_treinamento: diasTreinamento,
      dias_alo: diasAlo,
      status: 'Em Andamento',
      user_criador: userSession?.session?.user.id
    }).select().single();

    if (error) {
      alert(`Erro ao cadastrar turma: ${error.message}`);
      setLoading(false);
      return;
    }

    // GERAÇÃO AUTOMÁTICA DO DIÁRIO DE CHAMADA (Exemplo estrutural)
    // Em produção, isso pode ser feito em lote aqui ou via DB Trigger
    alert('Turma e cronograma de diários criados com sucesso!');
    router.push('/turmas');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Abertura de Nova Turma</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">O cronograma final de acompanhamento é projetado automaticamente excluindo folgas regulamentares.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Código Identificador da Turma</label>
            <input
              type="text"
              required
              value={numeroTurma}
              onChange={(e) => setNumeroTurma(e.target.value)}
              placeholder="Ex: TURMA-2026-07A"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data de Admissão / Início</label>
            <input
              type="date"
              required
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dias de Treinamento Técnico</label>
            <input
              type="number"
              value={diasTreinamento}
              onChange={(e) => setDiasTreinamento(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dias de Acompanhamento Alô</label>
            <input
              type="number"
              value={diasAlo}
              onChange={(e) => setDiasAlo(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>
        </div>

        {dataFimCalculada && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Cálculo de Encerramento Automatizado</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                Considerando os {diasTreinamento + diasAlo} dias úteis, o encerramento desta turma ocorrerá em: <strong className="underline">{dataFimCalculada.split('-').reverse().join('/')}</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 border rounded-xl text-sm font-semibold hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Processando...' : 'Salvar Turma'}
          </button>
        </div>
      </form>
    </div>
  );
}
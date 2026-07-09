'use client';

export const runtime = 'edge';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroUnificado() {
  const router = useRouter();
  const [turma, setTurma] = useState({ numero: '', operacao: '', instrutor: '' });
  const [listaColaboradores, setListaColaboradores] = useState('');

  async function salvarTudo() {
    try {
      // 1. Inserir a turma
      const { data: turmaData, error: errTurma } = await supabase
        .from('turmas')
        .insert([{ 
          numero_turma: turma.numero, 
          nome_operacao: turma.operacao, 
          instrutor_analista_matricula: turma.instrutor 
        }])
        .select()
        .single();

      if (errTurma) throw errTurma;

      // 2. Preparar lista de colaboradores para inserir em lote
      // Espera-se que você cole: "Matricula [TAB] Nome"
      const linhas = listaColaboradores.split('\n').filter(l => l.trim() !== '');
      const novosColaboradores = linhas.map(linha => {
        const [matricula, nome] = linha.split('\t');
        return {
          matricula: matricula?.trim(),
          nome: nome?.trim(),
          numero_turma: turma.numero // Vincula o colaborador à turma criada acima
        };
      });

      // 3. Inserir todos os colaboradores de uma vez
      const { error: errColab } = await supabase
        .from('colaboradores')
        .insert(novosColaboradores);

      if (errColab) throw errColab;

      alert('Turma e Colaboradores cadastrados com sucesso!');
      router.push('/turmas');
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Cadastro de Turma e Equipe</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input placeholder="Nº Turma" className="p-2 border rounded" onChange={e => setTurma({...turma, numero: e.target.value})} />
        <input placeholder="Operação" className="p-2 border rounded" onChange={e => setTurma({...turma, operacao: e.target.value})} />
        <input placeholder="Instrutor" className="p-2 border rounded" onChange={e => setTurma({...turma, instrutor: e.target.value})} />
      </div>

      <textarea 
        placeholder="Cole aqui a lista (Matrícula [TAB] Nome)..." 
        className="w-full h-64 p-4 border rounded font-mono text-sm"
        onChange={e => setListaColaboradores(e.target.value)}
      />

      <button 
        onClick={salvarTudo}
        className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700"
      >
        Salvar Tudo
      </button>
    </div>
  );
}

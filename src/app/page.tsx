import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        
        {/* Alerta de Sucesso */}
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
          <CheckCircle2 size={16} /> Sistema online e implantado!
        </div>
        
        {/* Título Principal */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
          Bem-vindo ao <span className="text-indigo-600">Presenteísmo App</span>
        </h1>
        
        {/* Descrição */}
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          O sistema inteligente para monitoramento, análise de presença e otimização de produtividade de turmas.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link 
            href="/login" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all gap-2 group"
          >
            Acessar o Sistema
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/cadastro" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium px-8 py-3 rounded-xl shadow-sm transition-all"
          >
            Criar Nova Conta
          </Link>
        </div>

      </div>
    </div>
  );
}

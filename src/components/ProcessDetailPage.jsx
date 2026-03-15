import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, RefreshCw, Share2, FileText, Hash, Calendar, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { getWhatsAppLink } from '@/lib/whatsappConfig';

const ProcessDetailPage = () => {
  const { processId } = useParams();
  const navigate = useNavigate();
  const [processo, setProcesso] = useState(null);
  const [andamentos, setAndamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    console.log(`[ProcessDetail] START fetching for ID: ${processId}`);

    try {
      if (!processId) throw new Error("ID do processo não fornecido na URL.");

      // 1. Fetch Process Details
      const { data: procData, error: procError } = await supabase
        .from('processos')
        .select('*')
        .eq('id', processId)
        .single();

      if (procError) {
        console.error("[ProcessDetail] Error fetching process:", procError);
        throw new Error("Não foi possível carregar os detalhes do processo.");
      }
      
      if (!procData) throw new Error("Processo não encontrado.");

      console.log("[ProcessDetail] Process loaded:", procData);
      setProcesso(procData);

      // 2. Fetch Andamentos
      const { data: andData, error: andError } = await supabase
        .from('andamentos')
        .select('*')
        .eq('processo_id', processId)
        .order('data_andamento', { ascending: false });

      if (andError) {
         console.error("[ProcessDetail] Error fetching andamentos:", andError);
         // Don't block the UI if only andamentos fail, just log it
      }

      console.log(`[ProcessDetail] Andamentos loaded: ${andData?.length || 0} items`);
      setAndamentos(andData || []);
      
    } catch (err) {
      console.error("[ProcessDetail] Critical error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [processId]);

  const handleShare = (item) => {
    const formattedDate = new Date(item.data_andamento).toLocaleDateString('pt-BR');
    const shareText = `*Atualização do Processo*\n\n*Nº Processo:* ${processo.numero_processo}\n*Data:* ${formattedDate}\n*Tipo:* ${item.tipo}\n\n*Andamento:* ${item.descricao}\n\n*Explicação:* ${item.explicacao_simplificada || "Ver no sistema."}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Copiado!",
        description: "Texto copiado. Abrindo WhatsApp...",
      });
    });

    // Open WhatsApp
    setTimeout(() => {
      window.open(getWhatsAppLink(shareText), '_blank');
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4 p-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse text-center">Carregando detalhes do processo...</p>
      </div>
    );
  }

  if (error || !processo) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
        <div className="bg-red-900/10 border border-red-800/50 rounded-xl p-6 max-w-md text-center w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
          <p className="text-slate-300 mb-6 text-sm">{error || "Processo não encontrado."}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="border-slate-700 hover:bg-slate-800 w-full sm:w-auto">
              Voltar
            </Button>
            <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" /> Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-10">
      {/* Sticky Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center overflow-hidden gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white shrink-0 -ml-2" onClick={() => navigate('/client-dashboard')}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-slate-500 font-mono truncate">{processo.numero_processo}</span>
                <h1 className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                  {processo.descricao}
                </h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchData} className="text-slate-500 hover:text-white shrink-0">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        
        {/* Main Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8 shadow-lg">
            <div className="p-5 sm:p-6 space-y-4">
               <div className="flex justify-between items-start gap-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{processo.descricao}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
                    processo.status === 'Ativo' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                    processo.status === 'Concluído' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  }`}>
                    {processo.status}
                  </span>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 flex items-center gap-3">
                     <Hash className="w-4 h-4 text-slate-500" />
                     <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Processo</span>
                        <span className="text-sm font-mono text-slate-300">{processo.numero_processo}</span>
                     </div>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 flex items-center gap-3">
                     <Scale className="w-4 h-4 text-slate-500" />
                     <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Tribunal</span>
                        <span className="text-sm text-slate-300">{processo.tribunal}</span>
                     </div>
                  </div>
               </div>
            </div>
        </div>

        {/* Timeline Header */}
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pl-1">
            <Clock className="w-5 h-5 text-blue-500" /> Histórico de Movimentações
        </h3>

        {/* Timeline */}
        <div className="relative border-l-2 border-slate-800 ml-3 sm:ml-4 space-y-8 pb-4">
            {andamentos.length === 0 ? (
                <div className="pl-8 py-4">
                  <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-lg p-8 text-center">
                    <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Nenhum andamento registrado ainda.</p>
                  </div>
                </div>
            ) : (
                andamentos.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-6 sm:pl-10"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] z-10"></div>
                        
                        {/* Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-blue-500/30 transition-all">
                            
                            {/* Card Header: Date & Type */}
                            <div className="bg-slate-950/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-mono">
                                   <Calendar className="w-3 h-3" />
                                   {new Date(item.data_andamento).toLocaleDateString('pt-BR')}
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                  {item.tipo}
                                </span>
                            </div>

                            <div className="p-4 sm:p-5">
                                {/* Official Description */}
                                <div className="mb-4">
                                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">Andamento Oficial</p>
                                  <h4 className="text-white text-base font-medium leading-relaxed">
                                    {item.descricao}
                                  </h4>
                                </div>
                                
                                {/* Simplified Explanation Box */}
                                {item.explicacao_simplificada ? (
                                    <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-lg p-4 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-indigo-400" /> 
                                            <span className="text-indigo-300 text-xs font-bold uppercase tracking-wide">Explicação Simplificada</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed">
                                          {item.explicacao_simplificada}
                                        </p>
                                    </div>
                                ) : (
                                  <div className="bg-slate-950/30 border border-slate-800 p-3 rounded-lg text-center">
                                    <p className="text-xs text-slate-500 italic">
                                      Análise simplificada em processamento...
                                    </p>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="mt-5 pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row gap-3">
                                    {item.texto_original && (
                                        <details className="w-full sm:flex-1">
                                            <summary className="text-xs text-slate-500 hover:text-blue-400 transition-colors cursor-pointer select-none py-2 flex items-center gap-2 w-fit">
                                              <FileText className="w-4 h-4" />
                                              Ver texto jurídico original
                                            </summary>
                                            <div className="mt-2 p-3 bg-black/30 rounded text-xs text-slate-400 font-mono border border-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                                              {item.texto_original}
                                            </div>
                                        </details>
                                    )}
                                    
                                    <Button 
                                      onClick={() => handleShare(item)}
                                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                                    >
                                      <Share2 className="w-4 h-4 mr-2" /> 
                                      Compartilhar via WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
      </main>
    </div>
  );
};

export default ProcessDetailPage;
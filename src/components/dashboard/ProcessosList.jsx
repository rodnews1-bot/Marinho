import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Clock, Gavel, Sparkles, ChevronRight, AlertCircle, Hash, Copy, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getTermExplanation } from '@/lib/legalTermsDictionary';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';

const ProcessosList = ({ clienteId }) => {
  const [processos, setProcessos] = useState([]);
  const [latestAndamentos, setLatestAndamentos] = useState({});
  const [loading, setLoading] = useState(true);
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async (isBackgroundRefresh = false) => {
    if (!clienteId) return;
    
    if (!isBackgroundRefresh) setLoading(true);

    try {
        const { data: procData, error } = await supabase
          .from('processos')
          .select('*')
          .eq('cliente_id', clienteId);
        
        if (error) throw error;

        // Safety check for data isolation
        const validProcessos = procData ? procData.filter(p => p.cliente_id === clienteId) : [];
        setProcessos(validProcessos);

        // Fetch updates
        const andamentosMap = {};
        await Promise.all(validProcessos.map(async (proc) => {
          const { data: andData } = await supabase
            .from('andamentos')
            .select('*')
            .eq('processo_id', proc.id)
            .order('data_andamento', { ascending: false })
            .limit(1);
          
          if (andData && andData.length > 0) {
            andamentosMap[proc.id] = andData[0];
          }
        }));
        setLatestAndamentos(andamentosMap);

    } catch (err) {
        console.error("Error fetching processos", err);
        if (!isBackgroundRefresh) {
            toast({ variant: "destructive", title: "Erro ao carregar", description: "Não foi possível buscar seus processos." });
        }
    } finally {
        setLoading(false);
        setFirstLoadDone(true);
    }
  };

  // Initial Fetch & Polling for Real-Time Simulation
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
        fetchData(true);
    }, 5000); // 5 seconds polling

    return () => clearInterval(interval);
  }, [clienteId]);

  const handleCopyProcessNumber = (e, number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(number);
    toast({
      title: "Número copiado",
      description: "Número do processo copiado para a área de transferência.",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'concluído': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'aguardando': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'suspenso': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (loading && !firstLoadDone) return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
       <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
       <p className="text-slate-400 text-sm animate-pulse">Buscando seus processos...</p>
    </div>
  );

  if (processos.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
        <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="font-medium text-slate-400 text-lg">Nenhum processo encontrado.</p>
        <p className="text-sm mt-2 max-w-xs mx-auto">Seus processos aparecerão aqui assim que forem cadastrados pela nossa equipe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {processos.map((proc, index) => {
        const latestUpdate = latestAndamentos[proc.id];
        const statusInfo = getTermExplanation(proc.status);
        
        return (
          <motion.div 
            key={proc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/process/${proc.id}`)}
            className="group bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-blue-500/40 transition-all cursor-pointer shadow-sm hover:shadow-blue-900/10 relative overflow-hidden"
          >
            {/* Status Badge & Date */}
            <div className="flex items-center justify-between mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(proc.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${proc.status === 'Ativo' ? 'bg-green-400 animate-pulse' : 'bg-current'}`}></span>
                        {proc.status}
                      </span>
                  </TooltipTrigger>
                  {statusInfo && (
                    <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
                      <p>{statusInfo.explanation}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <span className="text-slate-500 text-xs flex items-center gap-1 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800/50">
                <Clock className="w-3 h-3" />
                {new Date(proc.data_atualizacao).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            {/* Main Info */}
            <div className="mb-5">
               <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                 {proc.descricao}
               </h3>
               
               {/* Responsive Process Number Box */}
               <div 
                 className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 w-full sm:w-fit group/number hover:border-slate-700 transition-colors"
                 onClick={(e) => handleCopyProcessNumber(e, proc.numero_processo)}
               >
                 <div className="bg-slate-900 p-1.5 rounded text-slate-500">
                    <Hash className="w-4 h-4" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Número do Processo</p>
                    <p className="text-slate-300 font-mono text-sm sm:text-base font-medium truncate">
                        {proc.numero_processo}
                    </p>
                 </div>
                 <Copy className="w-4 h-4 text-slate-600 opacity-0 group-hover/number:opacity-100 transition-opacity" />
               </div>

               <div className="flex items-center gap-2 mt-3 text-slate-400 text-xs sm:text-sm">
                 <Gavel className="w-4 h-4 text-slate-500" />
                 <span>{proc.tribunal}</span>
               </div>
            </div>

            {/* AI Explanation of Latest Update */}
            {latestUpdate && latestUpdate.explicacao_simplificada ? (
              <div className="mt-4 bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-4 relative">
                 <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500 rounded-l-lg"></div>
                 <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Última Atualização (Simplificada)</span>
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                   {latestUpdate.explicacao_simplificada}
                 </p>
                 <div className="mt-2 text-xs text-slate-500 font-mono flex items-center gap-2">
                    <span>{new Date(latestUpdate.data_andamento).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] uppercase">{latestUpdate.tipo}</span>
                 </div>
              </div>
            ) : (
              <div className="mt-4 bg-slate-950/50 border border-slate-800 rounded-lg p-3 flex items-center gap-3 text-slate-500 text-sm">
                 <AlertCircle className="w-4 h-4 shrink-0" />
                 <span>Nenhuma explicação recente disponível.</span>
              </div>
            )}

            {/* Hover Action */}
            <div className="mt-5 pt-3 border-t border-slate-800/50 flex items-center justify-end text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
              Ver detalhes <ChevronRight className="w-4 h-4 ml-1" />
            </div>

          </motion.div>
        );
      })}
    </div>
  );
};

export default ProcessosList;
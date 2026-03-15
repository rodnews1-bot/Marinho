import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { parseProcessData } from '@/lib/processParser';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { FileText, CheckCircle2, AlertCircle, ArrowRight, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [text, setText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleParse = () => {
    const result = parseProcessData(text);
    if (result.error) {
      setError(result.error);
      setParsedData(null);
    } else {
      setParsedData(result);
      setError(null);
    }
  };

  const handleConfirm = async () => {
    if (!parsedData) return;
    setIsSaving(true);
    
    try {
      let createdProcessesCount = 0;
      let createdAndamentosCount = 0;

      // 1. Create Processes (or get ID if exists - simplified here to just create or update)
      // Since our mock DB is simple, we'll try to find existing first
      
      const processMap = {}; // number -> id

      for (const proc of parsedData.processes) {
        // Check existence
        const { data: existing } = await supabase.from('processos').select('*').eq('numero_processo', proc.number);
        
        let processId;
        
        if (existing && existing.length > 0) {
           processId = existing[0].id;
        } else {
           // Create new
           const { data: newProc } = await supabase.from('processos').insert([{
             numero_processo: proc.number,
             status: 'Ativo',
             descricao: `Processo Importado ${proc.number}`,
             data_atualizacao: new Date().toISOString(),
             // IMPORTANT: In a real app we'd need to prompt for Client ID. 
             // Here we'll default to the first client in DB as fallback for the demo
             cliente_id: 'c1' 
           }]);
           if (newProc && newProc.length > 0) {
             processId = newProc[0].id;
             createdProcessesCount++;
           }
        }
        processMap[proc.number] = processId;
      }

      // 2. Create Andamentos
      for (const andamento of parsedData.andamentos) {
        const pid = processMap[andamento.process_number];
        if (pid) {
          await supabase.from('andamentos').insert([{
            processo_id: pid,
            data_andamento: andamento.date,
            descricao: `${andamento.type} - ${andamento.description}`
          }]);
          createdAndamentosCount++;
        }
      }

      toast({
        title: "Importação Concluída",
        description: `${createdProcessesCount} novos processos e ${createdAndamentosCount} andamentos adicionados.`,
      });
      
      if (onSuccess) onSuccess();
      
      // Reset and close
      setText('');
      setParsedData(null);
      onClose();

    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados no sistema."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Importar Processos (IA)">
      <div className="space-y-4">
        {!parsedData ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
              <p className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                Cole o texto completo contendo um ou mais processos. O sistema identificará automaticamente os números e associará os andamentos.
              </p>
            </div>
            
            <textarea
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-md p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 resize-none font-mono"
              placeholder="Exemplo:
0012345-88.2024.8.11.0001
25/05/2024 - Movimentação...
              "
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {error && (
              <div className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleParse} className="bg-blue-600 hover:bg-blue-700">
                Analisar Texto
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white">Resultado da Análise</h3>
              <Button variant="ghost" size="sm" onClick={() => setParsedData(null)} className="text-slate-400 hover:text-white">
                <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Voltar
              </Button>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex gap-4 mb-4">
                 <div className="bg-slate-950 px-3 py-2 rounded border border-slate-800">
                    <span className="block text-xs text-slate-500 uppercase">Processos</span>
                    <span className="text-xl font-bold text-white">{parsedData.processes.length}</span>
                 </div>
                 <div className="bg-slate-950 px-3 py-2 rounded border border-slate-800">
                    <span className="block text-xs text-slate-500 uppercase">Andamentos</span>
                    <span className="text-xl font-bold text-white">{parsedData.andamentos.length}</span>
                 </div>
              </div>

              {parsedData.processes.map((proc, i) => (
                <div key={i} className="space-y-2">
                   <h4 className="text-sm font-mono text-green-400 border-b border-slate-800 pb-1">{proc.number}</h4>
                   <div className="pl-4 space-y-2">
                     {parsedData.andamentos.filter(a => a.process_number === proc.number).map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-400">
                           <span className="text-white font-medium">{item.date}</span> - {item.type}
                        </div>
                     ))}
                     {parsedData.andamentos.filter(a => a.process_number === proc.number).length === 0 && (
                        <span className="text-xs text-slate-600 italic">Nenhum andamento novo para este processo.</span>
                     )}
                   </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancelar</Button>
              <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Salvar no Banco
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

export default ProcessUploadModal;
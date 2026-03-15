import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Info, Phone, FileText, Users, ShieldAlert } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const InformacoesCaso = ({ clienteId }) => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  const fetchInfo = async (isBackgroundRefresh = false) => {
    if (!clienteId) return;

    if (!isBackgroundRefresh) setLoading(true);

    try {
      const { data, error } = await supabase
          .from('informacoes_caso')
          .select('*')
          .eq('cliente_id', clienteId);
      
      if (error) throw error;

      // Data Isolation Check
      const safeData = data ? data.filter(i => i.cliente_id === clienteId) : [];
      setInfo(safeData);

    } catch (err) {
      console.error("Error fetching case info:", err);
    } finally {
      setLoading(false);
      setFirstLoadDone(true);
    }
  };

  useEffect(() => {
    fetchInfo();
    const interval = setInterval(() => fetchInfo(true), 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [clienteId]);

  if (loading && !firstLoadDone) return <div className="text-slate-400 animate-pulse text-sm p-4">Carregando informações...</div>;
  if (info.length === 0) return <div className="text-slate-500 text-sm p-4 text-center bg-slate-900/30 rounded border border-slate-800">Nenhuma informação adicional registrada para este caso.</div>;

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {info.map((item) => (
        <div key={item.id} className="space-y-3">
           <AccordionItem value={`item-${item.id}-dados`} className="border border-slate-800 rounded-lg px-4 bg-slate-900/30">
            <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-1.5 rounded-md">
                   <Info className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-medium text-sm sm:text-base">Dados Relevantes</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed pt-2 pb-4 text-sm sm:text-base border-t border-slate-800/50 mt-2">
              {item.dados_relevantes}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value={`item-${item.id}-contatos`} className="border border-slate-800 rounded-lg px-4 bg-slate-900/30">
            <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline py-4">
              <div className="flex items-center gap-3">
                 <div className="bg-green-500/10 p-1.5 rounded-md">
                   <Users className="w-4 h-4 text-green-400" />
                 </div>
                <span className="font-medium text-sm sm:text-base">Equipe & Contatos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed pt-2 pb-4 text-sm sm:text-base border-t border-slate-800/50 mt-2">
               {/* Parsing the contacts string to look like a team list if possible, or just text */}
               <div className="whitespace-pre-wrap">
                  {item.contatos}
               </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value={`item-${item.id}-docs`} className="border border-slate-800 rounded-lg px-4 bg-slate-900/30">
            <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline py-4">
              <div className="flex items-center gap-3">
                 <div className="bg-amber-500/10 p-1.5 rounded-md">
                   <FileText className="w-4 h-4 text-amber-400" />
                 </div>
                <span className="font-medium text-sm sm:text-base">Documentos Necessários</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed pt-2 pb-4 text-sm sm:text-base border-t border-slate-800/50 mt-2">
              {item.documentos}
            </AccordionContent>
          </AccordionItem>
        </div>
      ))}
    </Accordion>
  );
};

export default InformacoesCaso;
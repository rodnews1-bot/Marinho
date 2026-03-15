import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DollarSign, AlertTriangle, CheckCircle2, Download, CreditCard, Barcode, Calendar, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClient } from '@/context/ClientContext';
import { useToast } from '@/components/ui/use-toast';

const FinanceiroSection = ({ clienteId }) => {
  const { client } = useClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const { toast } = useToast();

  const activeClientId = clienteId || client?.id;

  const loadData = async (isBackgroundRefresh = false) => {
      if (!activeClientId) return;

      if (!isBackgroundRefresh) setLoading(true);
      
      let allItems = [];
      let total = 0;

      try {
        const { data: boletos, error } = await supabase
          .from('boletos')
          .select('*')
          .eq('cliente_id', activeClientId);
        
        if (error) throw error;

        // Data Isolation Check
        const safeBoletos = boletos ? boletos.filter(b => b.cliente_id === activeClientId) : [];
        
        if (safeBoletos.length > 0) {
          const formattedBoletos = safeBoletos.map(b => {
             // Logic to determine status
             let status = 'PENDING';
             if (b.status === 'Pago') status = 'CONFIRMED';
             else if (b.status === 'Cancelado') status = 'CANCELED';
             else if (new Date(b.data_vencimento) < new Date()) status = 'OVERDUE';
             
             return {
               id: b.id,
               date: b.data_vencimento,
               description: b.descricao,
               value: parseFloat(b.valor),
               status: status,
               type: 'MANUAL',
               barcode: b.numero_boleto,
               link: b.link_pagamento
             };
          });
          
          allItems = [...allItems, ...formattedBoletos];
          
          // Add to total
          safeBoletos.forEach(b => {
             if (b.status !== 'Pago' && b.status !== 'Cancelado') total += parseFloat(b.valor);
          });
        }
      } catch (err) {
        console.error("Error fetching boletos", err);
      } finally {
        // Sort by due date (descending)
        allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

        setItems(allItems);
        setTotalDebt(total);
        setLoading(false);
        setFirstLoadDone(true);
      }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [activeClientId]);

  const handlePay = (item) => {
    if (item.link) {
        window.open(item.link, '_blank');
    } else if (item.barcode) {
        navigator.clipboard.writeText(item.barcode);
        toast({ title: "Código de barras copiado!", description: "Cole no app do seu banco para pagar." });
    } else {
        toast({ title: "Pagamento Indisponível", description: "Entre em contato com o escritório." });
    }
  };

  const handleDownload = (item) => {
    if (item.link) {
        window.open(item.link, '_blank');
    } else {
        toast({ title: "PDF Indisponível", description: "Use o código de barras ou entre em contato." });
    }
  };

  if (loading && !firstLoadDone) return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-white hidden sm:block">Financeiro</h2>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-green-500/5 skew-x-12 transform translate-x-12"></div>
        <h3 className="text-slate-400 text-sm font-medium mb-1 relative z-10">Total Pendente</h3>
        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl font-bold text-white">R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-sm text-slate-500">em honorários</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {items.length === 0 ? (
               <tr><td colSpan="5" className="p-8 text-center text-slate-500">Nenhuma cobrança encontrada.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-slate-300 font-mono">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">
                    R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === 'RECEIVED' || item.status === 'CONFIRMED' ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full bg-green-900/20 border border-green-900/50">
                        <CheckCircle2 className="w-3 h-3" /> Pago
                      </span>
                    ) : item.status === 'OVERDUE' ? (
                      <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full bg-red-900/20 border border-red-900/50">
                        <AlertTriangle className="w-3 h-3" /> Vencido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-900/20 border border-yellow-900/50">
                        <DollarSign className="w-3 h-3" /> Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {item.status !== 'RECEIVED' && item.status !== 'CONFIRMED' && (
                      <Button 
                        size="sm"
                        className="h-8 bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-900/20"
                        onClick={() => handlePay(item)}
                      >
                        {item.type === 'MANUAL' && !item.link ? <Barcode className="w-3 h-3 mr-2" /> : <CreditCard className="w-3 h-3 mr-2" />}
                        {item.type === 'MANUAL' && !item.link ? "Copiar" : "Pagar"}
                      </Button>
                    )}
                    {/* Add download button for paid items if needed, or if invoice available */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Visible only on small screens) */}
      <div className="md:hidden space-y-4">
        {items.length === 0 ? (
           <div className="text-center p-8 text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
             <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-30" />
             <p>Nenhuma cobrança encontrada.</p>
           </div>
        ) : (
          items.map(item => (
             <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2 text-slate-400 text-xs font-mono bg-slate-950 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString()}
                   </div>
                   {item.status === 'RECEIVED' || item.status === 'CONFIRMED' ? (
                      <span className="text-green-400 text-xs font-bold bg-green-900/20 px-2 py-1 rounded-full border border-green-900/50">Pago</span>
                    ) : item.status === 'OVERDUE' ? (
                      <span className="text-red-400 text-xs font-bold bg-red-900/20 px-2 py-1 rounded-full border border-red-900/50">Vencido</span>
                    ) : (
                      <span className="text-yellow-400 text-xs font-bold bg-yellow-900/20 px-2 py-1 rounded-full border border-yellow-900/50">Pendente</span>
                    )}
                </div>
                
                <h4 className="text-white font-medium mb-1">{item.description}</h4>
                <p className="text-2xl font-bold text-white mb-4">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                
                {item.status !== 'RECEIVED' && item.status !== 'CONFIRMED' && (
                  <div className="grid grid-cols-2 gap-2">
                     <Button 
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handlePay(item)}
                      >
                        {item.type === 'MANUAL' && !item.link ? "Copiar Código" : "Pagar Agora"}
                      </Button>
                      {item.link && (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full border-slate-700 text-slate-300"
                          onClick={() => handleDownload(item)}
                        >
                          <Download className="w-4 h-4 mr-2" /> Baixar PDF
                        </Button>
                      )}
                  </div>
                )}
             </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FinanceiroSection;
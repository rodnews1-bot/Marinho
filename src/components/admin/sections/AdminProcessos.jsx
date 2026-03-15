import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, FileText, UploadCloud, FileType, AlertCircle, RefreshCw, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { simplifyLegalText } from '@/lib/simplifyExplanation';
import { processPDF } from '@/lib/pdfProcessor';

const AdminProcessos = () => {
  const [processos, setProcessos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [andamentos, setAndamentos] = useState([]);
  const [loadingAndamentos, setLoadingAndamentos] = useState(false);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAndamentoModalOpen, setIsAndamentoModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [editingAndamento, setEditingAndamento] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cliente_id: '',
    numero_processo: '',
    descricao: '',
    status: 'Ativo',
    tribunal: '',
    data_atualizacao: new Date().toISOString().split('T')[0]
  });

  const [andamentoFormData, setAndamentoFormData] = useState({
    data_andamento: '',
    tipo: 'Movimentação',
    descricao: '',
    explicacao_simplificada: '',
    texto_original: ''
  });

  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [procRes, cliRes] = await Promise.all([
      supabase.from('processos').select('*'),
      supabase.from('clientes').select('*')
    ]);
    if (procRes.data) setProcessos(procRes.data);
    if (cliRes.data) setClientes(cliRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- Auto Generate Explanation Effect ---
  // When text changes, generate AI explanation
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Only generate if text exists, is long enough, and explanation is empty (to avoid overwriting manual edits)
      if (andamentoFormData.texto_original && andamentoFormData.texto_original.length > 15 && !andamentoFormData.explicacao_simplificada) {
           setIsGeneratingAI(true);
           try {
              const explanation = await simplifyLegalText(andamentoFormData.texto_original, andamentoFormData.tipo);
              setAndamentoFormData(prev => ({
                ...prev,
                explicacao_simplificada: explanation
              }));
              toast({ title: "IA", description: "Explicação gerada automaticamente." });
           } catch (err) {
              console.error(err);
           } finally {
              setIsGeneratingAI(false);
           }
      }
    }, 1500); // 1.5s delay after stop typing
    return () => clearTimeout(timer);
  }, [andamentoFormData.texto_original, andamentoFormData.tipo]);

  // --- Process Handlers ---

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        data_atualizacao: new Date(formData.data_atualizacao).toISOString()
      };

      if (editingItem) {
        await supabase.from('processos').update(payload).eq('id', editingItem.id);
        toast({ title: "Processo atualizado" });
      } else {
        await supabase.from('processos').insert([payload]);
        toast({ title: "Processo criado" });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar" });
    }
  };

  const handleEdit = async (item) => {
    setEditingItem(item);
    setFormData({
      cliente_id: item.cliente_id,
      numero_processo: item.numero_processo,
      descricao: item.descricao,
      status: item.status,
      tribunal: item.tribunal,
      data_atualizacao: new Date(item.data_atualizacao).toISOString().split('T')[0]
    });
    
    // Load andamentos for this process
    setLoadingAndamentos(true);
    const { data } = await supabase.from('andamentos').select('*').eq('processo_id', item.id).order('data_andamento', { ascending: false });
    setAndamentos(data || []);
    setLoadingAndamentos(false);

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este processo?')) {
      await supabase.from('processos').delete().eq('id', id);
      fetchData();
    }
  };

  // --- Andamento Handlers ---

  const openAndamentoModal = (item = null) => {
    if (item) {
      setEditingAndamento(item);
      setAndamentoFormData({
        data_andamento: new Date(item.data_andamento).toISOString().split('T')[0],
        tipo: item.tipo,
        descricao: item.descricao,
        explicacao_simplificada: item.explicacao_simplificada || '',
        texto_original: item.texto_original || ''
      });
    } else {
      setEditingAndamento(null);
      setAndamentoFormData({
        data_andamento: new Date().toISOString().split('T')[0],
        tipo: 'Movimentação',
        descricao: '',
        explicacao_simplificada: '',
        texto_original: ''
      });
    }
    setIsAndamentoModalOpen(true);
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({ variant: "destructive", title: "Arquivo inválido", description: "Por favor, envie apenas arquivos PDF." });
      return;
    }

    setIsProcessingPDF(true);
    try {
      const { text, type, rawDate } = await processPDF(file);
      
      const formattedDate = rawDate ? rawDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      // Update state with extracted data
      setAndamentoFormData(prev => ({
        ...prev,
        texto_original: text,
        tipo: type,
        descricao: `${type} - Documento Importado`,
        data_andamento: formattedDate,
        explicacao_simplificada: '' // Reset to trigger auto-generation
      }));

      toast({ title: "PDF Processado", description: "Texto extraído com sucesso. Gerando explicação..." });
      
      // Trigger AI immediately (skip debounce)
      setIsGeneratingAI(true);
      try {
          const explanation = await simplifyLegalText(text, type);
          setAndamentoFormData(prev => ({ ...prev, explicacao_simplificada: explanation }));
      } catch(err) {
          console.error("AI Generation failed immediately:", err);
      } finally {
          setIsGeneratingAI(false);
      }

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro na leitura", description: "Não foi possível ler o PDF. Tente copiar o texto manualmente." });
    } finally {
      setIsProcessingPDF(false);
      e.target.value = null;
    }
  };

  const handleSaveAndamento = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const payload = {
        processo_id: editingItem.id,
        data_andamento: andamentoFormData.data_andamento,
        tipo: andamentoFormData.tipo,
        descricao: andamentoFormData.descricao,
        explicacao_simplificada: andamentoFormData.explicacao_simplificada || "Aguardando análise.",
        texto_original: andamentoFormData.texto_original
      };

      if (editingAndamento) {
        await supabase.from('andamentos').update(payload).eq('id', editingAndamento.id);
        toast({ title: "Andamento atualizado" });
      } else {
        await supabase.from('andamentos').insert([payload]);
        toast({ title: "Andamento adicionado", description: "O cliente já pode visualizar a atualização." });
      }

      // Refresh list
      const { data } = await supabase.from('andamentos').select('*').eq('processo_id', editingItem.id).order('data_andamento', { ascending: false });
      setAndamentos(data || []);
      
      setIsAndamentoModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao salvar andamento" });
    }
  };

  const handleDeleteAndamento = async (id) => {
     if (window.confirm("Excluir este andamento?")) {
        await supabase.from('andamentos').delete().eq('id', id);
        // Refresh
        const { data } = await supabase.from('andamentos').select('*').eq('processo_id', editingItem.id).order('data_andamento', { ascending: false });
        setAndamentos(data || []);
     }
  };

  const getClientName = (id) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setEditingItem(null); setFormData({ cliente_id: clientes[0]?.id || '', numero_processo: '', descricao: '', status: 'Ativo', tribunal: '', data_atualizacao: new Date().toISOString().split('T')[0] }); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Novo Processo
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs uppercase bg-slate-950 text-slate-300">
              <tr>
                <th className="px-4 sm:px-6 py-3">Cliente</th>
                <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Nº Processo</th>
                <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Descrição</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="p-6 text-center">Carregando...</td></tr> : processos.map((proc) => (
                <tr key={proc.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-4 sm:px-6 py-4 font-medium text-white">
                    <div className="flex flex-col">
                      <span>{getClientName(proc.cliente_id)}</span>
                      <span className="sm:hidden text-xs text-slate-500 font-mono mt-1">{proc.numero_processo}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs hidden sm:table-cell">{proc.numero_processo}</td>
                  <td className="px-4 sm:px-6 py-4 max-w-xs truncate hidden md:table-cell">{proc.descricao}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      proc.status === 'Ativo' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      proc.status === 'Concluído' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                      'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }`}>
                      {proc.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(proc)} className="h-8 w-8 text-blue-400 hover:bg-blue-400/10"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(proc.id)} className="h-8 w-8 text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Process Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Gerenciar Processo" : "Novo Processo"}>
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800 mb-4 h-auto">
            <TabsTrigger value="dados" className="py-2">Dados Principais</TabsTrigger>
            <TabsTrigger value="andamentos" className="py-2" disabled={!editingItem}>Andamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Cliente</label>
                <select 
                  className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
                  required
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} - {c.cpf}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Número do Processo</label>
                <Input required value={formData.numero_processo} onChange={(e) => setFormData({...formData, numero_processo: e.target.value})} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Descrição</label>
                <Input required value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Status</label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Aguardando">Aguardando</option>
                    <option value="Suspenso">Suspenso</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tribunal</label>
                  <Input required value={formData.tribunal} onChange={(e) => setFormData({...formData, tribunal: e.target.value})} className="bg-slate-950 border-slate-800" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Data de Atualização</label>
                <Input type="date" required value={formData.data_atualizacao} onChange={(e) => setFormData({...formData, data_atualizacao: e.target.value})} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Salvar Dados</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="andamentos">
             <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-800/50 p-3 rounded-md border border-slate-700 gap-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" /> Histórico de Andamentos
                    </h4>
                    <Button size="sm" onClick={() => openAndamentoModal()} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs w-full sm:w-auto">
                        <Plus className="w-3 h-3 mr-1" /> Adicionar Novo
                    </Button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loadingAndamentos ? (
                        <div className="text-center py-4 text-slate-500">Carregando...</div>
                    ) : andamentos.length === 0 ? (
                        <div className="text-center py-8 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                            <p className="text-sm text-slate-500">Nenhum andamento registrado.</p>
                        </div>
                    ) : (
                        andamentos.map(item => (
                            <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500/30 transition-all group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-blue-400 uppercase bg-blue-900/20 px-2 py-0.5 rounded">{item.tipo}</span>
                                        <span className="text-xs text-slate-500 font-mono">{new Date(item.data_andamento).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => openAndamentoModal(item)}>
                                            <Pencil className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-400" onClick={() => handleDeleteAndamento(item.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-white font-medium mb-1 line-clamp-2">{item.descricao}</p>
                                {item.explicacao_simplificada && (
                                    <div className="mt-2 text-xs text-slate-400 italic border-l-2 border-indigo-500/30 pl-2 bg-slate-950/20 p-2 rounded-r">
                                        <span className="text-indigo-400 font-bold not-italic">Simplificado:</span> {item.explicacao_simplificada}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </Modal>

      {/* Add/Edit Andamento Modal */}
      <Modal isOpen={isAndamentoModalOpen} onClose={() => setIsAndamentoModalOpen(false)} title={editingAndamento ? "Editar Andamento" : "Novo Andamento"}>
        <form onSubmit={handleSaveAndamento} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Data</label>
                    <Input type="date" required value={andamentoFormData.data_andamento} onChange={(e) => setAndamentoFormData({...andamentoFormData, data_andamento: e.target.value})} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tipo</label>
                    <select className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" value={andamentoFormData.tipo} onChange={(e) => setAndamentoFormData({...andamentoFormData, tipo: e.target.value})}>
                        <option value="Movimentação">Movimentação</option>
                        <option value="Publicação">Publicação</option>
                        <option value="Decisão">Decisão</option>
                        <option value="Sentença">Sentença</option>
                        <option value="Audiência">Audiência</option>
                        <option value="Despacho">Despacho</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Título / Descrição Curta</label>
                <Input required value={andamentoFormData.descricao} onChange={(e) => setAndamentoFormData({...andamentoFormData, descricao: e.target.value})} className="bg-slate-950 border-slate-800" placeholder="Ex: Sentença de Procedência" />
            </div>

            <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                   <label className="text-sm font-medium text-slate-300">Texto Original</label>
                   {/* PDF Upload Button */}
                   <div className="relative w-full sm:w-auto">
                      <input 
                         type="file" 
                         accept="application/pdf" 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                         onChange={handlePDFUpload}
                         disabled={isProcessingPDF}
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 sm:h-7 text-xs border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-800 w-full sm:w-auto flex items-center justify-center">
                         {isProcessingPDF ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <UploadCloud className="w-3 h-3 mr-1" />}
                         {isProcessingPDF ? "Processando..." : "Enviar PDF"}
                      </Button>
                   </div>
                </div>
                <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-white min-h-[120px]" 
                    value={andamentoFormData.texto_original} 
                    onChange={(e) => setAndamentoFormData({...andamentoFormData, texto_original: e.target.value})} 
                    placeholder="Cole aqui o texto ou envie um PDF para extrair..."
                />
            </div>

            {/* Generated Explanation Display */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-indigo-400" /> 
                   Explicação Simplificada (IA)
                   {isGeneratingAI && <span className="text-xs text-indigo-400 animate-pulse ml-auto flex items-center"><Wand2 className="w-3 h-3 mr-1" /> Gerando...</span>}
                </label>
                
                <div className={`w-full rounded-md p-3 text-sm min-h-[80px] transition-all border ${
                  andamentoFormData.explicacao_simplificada 
                    ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}>
                    {andamentoFormData.explicacao_simplificada ? (
                      andamentoFormData.explicacao_simplificada
                    ) : (
                      <span className="italic flex flex-col items-center justify-center h-full gap-1 opacity-70">
                         {isGeneratingAI ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>A inteligência artificial está escrevendo...</span>
                            </>
                         ) : (
                            "A explicação aparecerá aqui automaticamente."
                         )}
                      </span>
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsAndamentoModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" disabled={isGeneratingAI || isProcessingPDF}>
                    Salvar Andamento
                </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProcessos;
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Pencil, Trash2, ChevronDown, ChevronUp, FileText, Info, Gavel, Copy, RefreshCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cleanCPF } from '@/lib/cpfUtils';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [infoCaso, setInfoCaso] = useState([]);
  const [andamentos, setAndamentos] = useState([]);
  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // -- UI States --
  const [expandedClient, setExpandedClient] = useState(null);
  
  // Client Modal
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  // Info Edit
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoFormData, setInfoFormData] = useState({});

  // Process Modal (Add/Edit)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [processFormData, setProcessFormData] = useState({
    cliente_id: '',
    numero_processo: '',
    descricao: '',
    status: 'Ativo',
    tribunal: '',
    data_atualizacao: ''
  });

  // Andamento Modal (Inside Process Edit)
  const [isAndamentoModalOpen, setIsAndamentoModalOpen] = useState(false);
  const [editingAndamento, setEditingAndamento] = useState(null);
  const [andamentoFormData, setAndamentoFormData] = useState({
     data_andamento: '',
     tipo: '',
     descricao: '',
     explicacao_simplificada: ''
  });

  const [clientFormData, setClientFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  // -- Data Fetching --
  const fetchData = async () => {
    setLoading(true);
    console.log('[Admin] Fetching all data...');
    try {
      const [cliRes, procRes, infoRes, andRes, bolRes] = await Promise.all([
        supabase.from('clientes').select('*'),
        supabase.from('processos').select('*'),
        supabase.from('informacoes_caso').select('*'),
        supabase.from('andamentos').select('*'),
        supabase.from('boletos').select('*')
      ]);
      
      if (cliRes.data) setClientes(cliRes.data);
      if (procRes.data) setProcessos(procRes.data);
      if (infoRes.data) setInfoCaso(infoRes.data);
      if (andRes.data) setAndamentos(andRes.data);
      if (bolRes.data) setBoletos(bolRes.data);
    } catch (err) {
      console.error('[Admin] Error fetching data:', err);
      toast({ variant: "destructive", title: "Erro ao carregar dados", description: "Verifique o console para mais detalhes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // -- Client Operations --
  const handleSaveClient = async (e) => {
    e.preventDefault();
    try {
      // Clean CPF before saving
      const cleanedCPF = cleanCPF(clientFormData.cpf);
      const dataToSave = { ...clientFormData, cpf: cleanedCPF };

      if (editingClient) {
        await supabase.from('clientes').update(dataToSave).eq('id', editingClient.id);
        toast({ title: "Cliente atualizado" });
      } else {
        await supabase.from('clientes').insert([dataToSave]);
        toast({ title: "Cliente criado", description: "O cliente já pode acessar o portal com o CPF cadastrado." });
      }
      setIsClientModalOpen(false);
      await fetchData(); // Force refresh
    } catch (error) { toast({ variant: "destructive", title: "Erro ao salvar" }); }
  };

  const handleDeleteClient = async (e, client) => {
    e.stopPropagation();
    if (!window.confirm(`ATENÇÃO: Você tem certeza que deseja excluir o cliente ${client.nome}?\n\nIsso apagará PERMANENTEMENTE:\n- O cadastro do cliente\n- Todos os processos\n- Todos os andamentos\n- Todas as informações financeiras (boletos)\n- Todos os membros da equipe associados\n- Todas as informações do caso\n\nEssa ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    console.log(`[Admin] Starting delete process for client ${client.id}`);

    try {
      // 1. Delete Andamentos (linked to processes)
      const clientProcessos = processos.filter(p => p.cliente_id === client.id);
      console.log(`[Admin] Deleting andamentos for ${clientProcessos.length} processes`);
      
      for (const proc of clientProcessos) {
        await supabase.from('andamentos').delete().eq('processo_id', proc.id);
      }

      // 2. Delete Processos
      console.log(`[Admin] Deleting processes`);
      await supabase.from('processos').delete().eq('cliente_id', client.id);

      // 3. Delete Financeiro (Boletos)
      console.log(`[Admin] Deleting financial records`);
      await supabase.from('boletos').delete().eq('cliente_id', client.id);

      // 4. Delete Membros (Members)
      console.log(`[Admin] Deleting members`);
      await supabase.from('membros').delete().eq('cliente_id', client.id);

      // 5. Delete Informações Caso
      console.log(`[Admin] Deleting case info`);
      await supabase.from('informacoes_caso').delete().eq('cliente_id', client.id);

      // 6. Delete Client
      console.log(`[Admin] Deleting client record`);
      const { error } = await supabase.from('clientes').delete().eq('id', client.id);

      if (error) throw error;

      toast({ 
        title: "Sucesso!", 
        description: "Cliente e todos os dados associados foram deletados permanentemente." 
      });
      
      // Explicitly wait before fetching to ensure simulated DB is updated
      setTimeout(async () => {
         await fetchData();
      }, 500);

    } catch (err) {
      console.error('[Admin] Delete failed:', err);
      toast({ variant: "destructive", title: "Erro ao deletar cliente", description: "Ocorreu um erro durante a exclusão. Tente novamente." });
      setLoading(false);
    }
  };

  const handleCloneClient = async (e, client) => {
    e.stopPropagation();
    if (!window.confirm(`Clonar o cliente "${client.nome}"?\n\nIsso criará uma cópia completa de todos os dados (processos, financeiro, informações) para um novo registro.`)) {
      return;
    }

    try {
      setLoading(true);

      // 1. Create New Client
      const newClientData = {
        ...client,
        id: undefined, // Let DB generate new ID
        nome: `${client.nome} - Cópia`,
        created_at: new Date().toISOString()
      };
      
      const { data: createdClients } = await supabase.from('clientes').insert([newClientData]);
      const newClient = createdClients[0];

      if (!newClient) throw new Error("Failed to create new client");

      // 2. Clone Informações Caso
      const clientInfo = infoCaso.filter(i => i.cliente_id === client.id);
      if (clientInfo.length > 0) {
        const newInfos = clientInfo.map(info => ({
          ...info,
          id: undefined,
          cliente_id: newClient.id,
          created_at: new Date().toISOString()
        }));
        await supabase.from('informacoes_caso').insert(newInfos);
      }

      // 3. Clone Boletos (Financeiro)
      const clientBoletos = boletos.filter(b => b.cliente_id === client.id);
      if (clientBoletos.length > 0) {
        const newBoletos = clientBoletos.map(boleto => ({
          ...boleto,
          id: undefined,
          cliente_id: newClient.id,
          created_at: new Date().toISOString()
        }));
        await supabase.from('boletos').insert(newBoletos);
      }
      
      // 4. Clone Membros
      // Note: Although fetching membros is not in the main fetchData yet, 
      // if we were to support full cloning we'd need to fetch them. 
      // Since fetch doesn't include 'membros' yet in UI, this clone only clones what is visible.
      // However, for consistency with delete, if we fetch them we could clone them.
      // For now, sticking to what is visible in UI state.

      // 5. Clone Processos & Andamentos
      const clientProcessos = processos.filter(p => p.cliente_id === client.id);
      
      for (const proc of clientProcessos) {
        // Insert Process
        const newProcData = {
          ...proc,
          id: undefined,
          cliente_id: newClient.id,
          created_at: new Date().toISOString()
        };
        const { data: createdProcs } = await supabase.from('processos').insert([newProcData]);
        const newProc = createdProcs[0];

        // Insert Andamentos for this Process
        const procAndamentos = andamentos.filter(a => a.processo_id === proc.id);
        if (procAndamentos.length > 0 && newProc) {
          const newAndamentos = procAndamentos.map(andamento => ({
            ...andamento,
            id: undefined,
            processo_id: newProc.id,
            created_at: new Date().toISOString()
          }));
          await supabase.from('andamentos').insert(newAndamentos);
        }
      }

      toast({ title: "Cliente clonado com sucesso" });
      fetchData();

    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Erro ao clonar cliente" });
      setLoading(false);
    }
  };

  const handleSaveInfo = async (clienteId) => {
    try {
      const existingInfo = infoCaso.find(i => i.cliente_id === clienteId);
      const payload = { cliente_id: clienteId, ...infoFormData };
      if (existingInfo) {
        await supabase.from('informacoes_caso').update(payload).eq('id', existingInfo.id);
      } else {
        await supabase.from('informacoes_caso').insert([payload]);
      }
      toast({ title: "Informações salvas" });
      setIsEditingInfo(false);
      fetchData();
    } catch (e) { toast({ variant: "destructive", title: "Erro ao salvar informações" }); }
  };

  // -- Process Operations --
  const openProcessModal = (process, clienteId) => {
    if (process) {
       setEditingProcess(process);
       setProcessFormData(process);
    } else {
       setEditingProcess(null);
       setProcessFormData({
          cliente_id: clienteId,
          numero_processo: '',
          descricao: '',
          status: 'Ativo',
          tribunal: '',
          data_atualizacao: new Date().toISOString().split('T')[0]
       });
    }
    setIsProcessModalOpen(true);
  };

  const handleSaveProcess = async (e) => {
    e.preventDefault();
    try {
      if (editingProcess) {
        await supabase.from('processos').update(processFormData).eq('id', editingProcess.id);
        toast({ title: "Processo atualizado" });
      } else {
        await supabase.from('processos').insert([processFormData]);
        toast({ title: "Processo criado" });
      }
      setIsProcessModalOpen(false);
      fetchData();
    } catch (e) { toast({ variant: "destructive", title: "Erro ao salvar processo" }); }
  };

  const handleDeleteProcess = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este processo?")) {
       await supabase.from('processos').delete().eq('id', id);
       fetchData();
       toast({ title: "Processo excluído" });
    }
  };

  // -- Andamento Operations --
  const openAndamentoModal = (andamento) => {
    if (andamento) {
        setEditingAndamento(andamento);
        setAndamentoFormData(andamento);
    } else {
        setEditingAndamento(null);
        setAndamentoFormData({
            data_andamento: new Date().toISOString().split('T')[0],
            tipo: 'Movimentação',
            descricao: '',
            explicacao_simplificada: ''
        });
    }
    setIsAndamentoModalOpen(true);
  };

  const handleSaveAndamento = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            ...andamentoFormData,
            processo_id: editingProcess.id
        };

        if (editingAndamento) {
            await supabase.from('andamentos').update(payload).eq('id', editingAndamento.id);
            toast({ title: "Andamento atualizado" });
        } else {
            await supabase.from('andamentos').insert([payload]);
            toast({ title: "Andamento adicionado" });
        }
        setIsAndamentoModalOpen(false);
        fetchData(); // Refresh to update list in background
    } catch(e) { toast({ variant: "destructive", title: "Erro ao salvar andamento" }); }
  };

  const handleDeleteAndamento = async (id) => {
    if (window.confirm("Excluir este andamento?")) {
        await supabase.from('andamentos').delete().eq('id', id);
        fetchData();
        toast({ title: "Andamento excluído" });
    }
  };


  // -- Render Helpers --
  const toggleExpand = (client) => {
    if (expandedClient === client.id) {
      setExpandedClient(null);
      setIsEditingInfo(false);
    } else {
      setExpandedClient(client.id);
      const info = infoCaso.find(i => i.cliente_id === client.id) || {};
      setInfoFormData({
        dados_relevantes: info.dados_relevantes || '',
        contatos: info.contatos || '',
        documentos: info.documentos || ''
      });
      setIsEditingInfo(false);
    }
  };

  const filteredClientes = clientes.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm));
  const currentProcessAndamentos = andamentos.filter(a => editingProcess && a.processo_id === editingProcess.id).sort((a,b) => new Date(b.data_andamento) - new Date(a.data_andamento));

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Buscar por nome ou CPF..." 
            className="pl-9 bg-slate-900 border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={fetchData} className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
             <RefreshCcw className="w-4 h-4 mr-2" /> Atualizar Dados
          </Button>
          <Button onClick={() => { setEditingClient(null); setClientFormData({ nome: '', cpf: '', email: '', telefone: '', endereco: '' }); setIsClientModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Button>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-4">
        {loading ? <div className="text-center py-8 text-slate-400">Carregando...</div> : filteredClientes.map((client) => {
            const clientProcessos = processos.filter(p => p.cliente_id === client.id);
            const isExpanded = expandedClient === client.id;

            return (
              <div key={client.id} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-800/50 gap-4 sm:gap-0" onClick={() => toggleExpand(client)}>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">{client.nome.charAt(0)}</div>
                      <div>
                         <h3 className="text-white font-medium">{client.nome}</h3>
                         <p className="text-sm text-slate-500 break-all sm:break-normal">{client.cpf} • {clientProcessos.length} Processos</p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditingClient(client); setClientFormData(client); setIsClientModalOpen(true); }} className="hover:bg-slate-700">
                           <Pencil className="w-4 h-4 text-slate-400 hover:text-white" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => handleCloneClient(e, client)} className="hover:bg-blue-900/20">
                           <Copy className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => handleDeleteClient(e, client)} className="hover:bg-red-900/20">
                           <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                        </Button>
                      </div>
                      {isExpanded ? <ChevronUp className="text-slate-500 ml-2" /> : <ChevronDown className="text-slate-500 ml-2" />}
                   </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/30 p-4 sm:p-6 grid lg:grid-cols-2 gap-8">
                     {/* Info Section */}
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-sm uppercase tracking-wider font-bold text-indigo-400 flex items-center gap-2"><Info className="w-4 h-4" /> Informações do Caso</h4>
                           {!isEditingInfo ? (
                             <Button size="sm" variant="ghost" onClick={() => setIsEditingInfo(true)} className="h-6 text-xs text-indigo-300">Editar</Button>
                           ) : (
                             <div className="flex gap-2">
                               <Button size="sm" variant="ghost" onClick={() => setIsEditingInfo(false)} className="h-6 text-xs">Cancelar</Button>
                               <Button size="sm" onClick={() => handleSaveInfo(client.id)} className="h-6 text-xs bg-indigo-600">Salvar</Button>
                             </div>
                           )}
                        </div>
                        <div className="bg-slate-900 rounded-md p-4 border border-slate-800 space-y-4">
                           <div>
                              <label className="text-xs text-slate-500 font-bold block mb-1">Dados Relevantes</label>
                              {isEditingInfo ? (
                                <textarea className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" rows={3} value={infoFormData.dados_relevantes} onChange={e => setInfoFormData({...infoFormData, dados_relevantes: e.target.value})} />
                              ) : <p className="text-sm text-slate-300 whitespace-pre-wrap">{infoFormData.dados_relevantes || 'Nenhuma informação registrada.'}</p>}
                           </div>
                        </div>
                     </div>

                     {/* Process Section */}
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm uppercase tracking-wider font-bold text-blue-400 flex items-center gap-2"><FileText className="w-4 h-4" /> Processos Associados</h4>
                            <Button size="sm" variant="outline" onClick={() => openProcessModal(null, client.id)} className="h-7 text-xs border-blue-900 text-blue-400 hover:bg-blue-900/30"><Plus className="w-3 h-3 mr-1" /> Novo Processo</Button>
                        </div>
                        {clientProcessos.length === 0 ? <div className="p-4 bg-slate-900 border border-slate-800 rounded-md text-sm text-slate-500 text-center">Nenhum processo.</div> : (
                           <div className="space-y-2">
                              {clientProcessos.map(proc => (
                                 <div key={proc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-md hover:border-blue-500/30 transition-colors flex justify-between items-center group">
                                    <div className="overflow-hidden">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-mono text-xs text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded truncate max-w-[150px]">{proc.numero_processo}</span>
                                            <span className="text-[10px] uppercase text-slate-500 border border-slate-700 px-1 rounded">{proc.status}</span>
                                        </div>
                                        <p className="text-sm text-white font-medium truncate">{proc.descricao}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => openProcessModal(proc, client.id)}><Pencil className="w-4 h-4" /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-950" onClick={() => handleDeleteProcess(proc.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
                )}
              </div>
            );
        })}
      </div>

      {/* MODALS */}
      {/* Client Modal */}
      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
        <form onSubmit={handleSaveClient} className="space-y-4">
          <Input placeholder="Nome Completo" required value={clientFormData.nome} onChange={(e) => setClientFormData({...clientFormData, nome: e.target.value})} className="bg-slate-950 border-slate-800" />
          <Input placeholder="CPF" required value={clientFormData.cpf} onChange={(e) => setClientFormData({...clientFormData, cpf: e.target.value})} className="bg-slate-950 border-slate-800" />
          <Input placeholder="Email" type="email" value={clientFormData.email} onChange={(e) => setClientFormData({...clientFormData, email: e.target.value})} className="bg-slate-950 border-slate-800" />
          <Input placeholder="Telefone" value={clientFormData.telefone} onChange={(e) => setClientFormData({...clientFormData, telefone: e.target.value})} className="bg-slate-950 border-slate-800" />
          <Input placeholder="Endereço" value={clientFormData.endereco} onChange={(e) => setClientFormData({...clientFormData, endereco: e.target.value})} className="bg-slate-950 border-slate-800" />
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsClientModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Salvar</Button>
          </div>
        </form>
      </Modal>

      {/* Process Modal */}
      <Modal isOpen={isProcessModalOpen} onClose={() => setIsProcessModalOpen(false)} title={editingProcess ? "Gerenciar Processo" : "Novo Processo"}>
        <Tabs defaultValue="dados" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-slate-900 border border-slate-800 mb-4 h-auto">
                <TabsTrigger value="dados" className="py-2">Dados Principais</TabsTrigger>
                <TabsTrigger value="andamentos" className="py-2" disabled={!editingProcess}>Andamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados">
                <form onSubmit={handleSaveProcess} className="space-y-4">
                    <Input placeholder="Número do Processo" required value={processFormData.numero_processo} onChange={(e) => setProcessFormData({...processFormData, numero_processo: e.target.value})} className="bg-slate-950 border-slate-800" />
                    <Input placeholder="Descrição" required value={processFormData.descricao} onChange={(e) => setProcessFormData({...processFormData, descricao: e.target.value})} className="bg-slate-950 border-slate-800" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" value={processFormData.status} onChange={(e) => setProcessFormData({...processFormData, status: e.target.value})}>
                            <option value="Ativo">Ativo</option>
                            <option value="Aguardando">Aguardando</option>
                            <option value="Suspenso">Suspenso</option>
                            <option value="Concluído">Concluído</option>
                        </select>
                        <Input placeholder="Tribunal" required value={processFormData.tribunal} onChange={(e) => setProcessFormData({...processFormData, tribunal: e.target.value})} className="bg-slate-950 border-slate-800" />
                    </div>
                    <Input type="date" required value={processFormData.data_atualizacao} onChange={(e) => setProcessFormData({...processFormData, data_atualizacao: e.target.value})} className="bg-slate-950 border-slate-800" />
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsProcessModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Salvar Processo</Button>
                    </div>
                </form>
            </TabsContent>

            <TabsContent value="andamentos">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 p-3 rounded border border-slate-800 gap-3">
                        <h4 className="text-sm font-medium text-white">Histórico de Movimentações</h4>
                        <Button size="sm" onClick={() => openAndamentoModal(null)} className="h-8 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"><Plus className="w-3 h-3 mr-1" /> Adicionar</Button>
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {currentProcessAndamentos.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">Nenhum andamento registrado.</p> : currentProcessAndamentos.map(andamento => (
                            <div key={andamento.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded text-sm group relative">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-blue-400 text-xs">{new Date(andamento.data_andamento).toLocaleDateString()}</span>
                                    <span className="text-xs text-slate-500 bg-slate-950 px-1 rounded border border-slate-800">{andamento.tipo}</span>
                                </div>
                                <p className="text-white mb-1">{andamento.descricao}</p>
                                {andamento.explicacao_simplificada && <p className="text-slate-400 text-xs italic bg-slate-950/30 p-1 rounded">Simplificado: {andamento.explicacao_simplificada}</p>}
                                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 bg-slate-900 border border-slate-700 rounded p-1">
                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openAndamentoModal(andamento)}><Pencil className="w-3 h-3" /></Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => handleDeleteAndamento(andamento.id)}><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </Modal>

      {/* Andamento Modal (Nested) */}
      <Modal isOpen={isAndamentoModalOpen} onClose={() => setIsAndamentoModalOpen(false)} title={editingAndamento ? "Editar Andamento" : "Novo Andamento"}>
         <form onSubmit={handleSaveAndamento} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Data</label>
                    <Input type="date" required value={andamentoFormData.data_andamento} onChange={(e) => setAndamentoFormData({...andamentoFormData, data_andamento: e.target.value})} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Tipo</label>
                    <select className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" value={andamentoFormData.tipo} onChange={(e) => setAndamentoFormData({...andamentoFormData, tipo: e.target.value})}>
                        <option value="Movimentação">Movimentação</option>
                        <option value="Publicação">Publicação</option>
                        <option value="Decisão">Decisão</option>
                        <option value="Audiência">Audiência</option>
                    </select>
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs text-slate-400">Descrição Oficial</label>
                <textarea required className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-white" rows={3} value={andamentoFormData.descricao} onChange={(e) => setAndamentoFormData({...andamentoFormData, descricao: e.target.value})} />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-slate-400">Explicação Simplificada (Cliente)</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-white" rows={3} value={andamentoFormData.explicacao_simplificada} onChange={(e) => setAndamentoFormData({...andamentoFormData, explicacao_simplificada: e.target.value})} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsAndamentoModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Salvar Andamento</Button>
            </div>
         </form>
      </Modal>

    </div>
  );
};

export default AdminClientes;
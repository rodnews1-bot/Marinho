import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { asaasService } from '@/lib/asaas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTermExplanation } from '@/lib/legalTermsDictionary';
import { generateDocument } from '@/lib/generateDocument';
import { initGoogleDriveApi, signInToGoogle, extractFolderId, listFilesInFolder, readDriveFileParams } from '@/lib/googleDriveApi';
import { 
  ArrowLeft, User, MapPin, Phone, Mail, FileText, 
  ExternalLink, Search, HelpCircle, RefreshCw, CreditCard,
  Bot, Folder, FileSignature
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pasteData, setPasteData] = useState('');
  const [parsedUpdates, setParsedUpdates] = useState([]);
  const [syncing, setSyncing] = useState(false);
  
  // AI and Drive
  const [informacoesCaso, setInformacoesCaso] = useState(null);
  const [aiContext, setAiContext] = useState('');
  const [aiDocumentType, setAiDocumentType] = useState('Petição Inicial');
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [isScanningDrive, setIsScanningDrive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Client
      const { data: clientData } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id);
        
      if (clientData && clientData.length > 0) {
        setClient(clientData[0]);
        
        // Fetch Processes
        const { data: processData } = await supabase
          .from('processos')
          .select('*')
          .eq('cliente_id', id);
          
        setProcesses(processData || []);

        // Fetch Informações do Caso
        const { data: infoData } = await supabase
          .from('informacoes_caso')
          .select('*')
          .eq('cliente_id', id);
          
        if (infoData && infoData.length > 0) {
          setInformacoesCaso(infoData[0]);
        }
      }
      
      setLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  const handleJusBrasilSearch = () => {
    window.open(`https://www.jusbrasil.com.br/iniciar-pesquisa/`, '_blank');
  };

  const handleParseAndamentos = () => {
    if (!pasteData) return;
    
    const lines = pasteData.split('\n').filter(line => line.trim().length > 0);
    const parsed = lines.map((line, index) => ({
      id: index,
      text: line,
      date: new Date().toLocaleDateString(), // Mock date as we just pasted it
      explanation: getTermExplanation(line)
    }));
    
    setParsedUpdates(parsed);
  };

  const handleSyncAsaas = async () => {
    if (!client) return;
    setSyncing(true);
    try {
      const asaasCustomer = await asaasService.createCustomer(client);
      
      if (asaasCustomer && asaasCustomer.id) {
        // Update local client with Asaas ID
        await supabase
          .from('clientes')
          .update({ asaas_customer_id: asaasCustomer.id })
          .eq('id', client.id);
          
        setClient(prev => ({ ...prev, asaas_customer_id: asaasCustomer.id }));
        toast({ title: "Sincronizado com Asaas", description: `ID: ${asaasCustomer.id}` });
      } else {
        throw new Error("Falha ao obter ID do Asaas");
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro na sincronização", description: error.message });
    }
    setSyncing(false);
  };

  const handleGenerateDocument = async () => {
    if (!aiContext.trim()) {
      toast({ variant: "destructive", title: "Contexto vazio", description: "Escreva os fatos ou detalhes do caso antes de gerar." });
      return;
    }
    
    setGeneratingDoc(true);
    setGeneratedDocument('');
    try {
      const result = await generateDocument(aiContext, aiDocumentType, client.nome, client.cpf);
      setGeneratedDocument(result);
      toast({ title: "Documento Gerado", description: "A IA criou o documento com sucesso." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro na IA", description: error.message });
    }
    setGeneratingDoc(false);
  };

  const handleScanDrive = async () => {
    if (!informacoesCaso?.documentos) {
       toast({ variant: "destructive", title: "Sem Link", description: "O cliente não tem nenhuma pasta do Drive vinculada." });
       return;
    }

    try {
       setIsScanningDrive(true);
       toast({ title: "Conectando ao Google...", description: "Autorize o acesso na janela que irá abrir." });
       
       const token = await signInToGoogle();
       const folderId = extractFolderId(informacoesCaso.documentos);
       
       if (!folderId) {
          throw new Error("Link do Drive inválido. Cole a URL completa de uma pasta válida.");
       }

       toast({ title: "Buscando Arquivos", description: "Listando PDFs e Documentos na pasta do cliente..." });
       await initGoogleDriveApi(); // Certificar que API está pronta
       const files = await listFilesInFolder(folderId, token);
       
       if (files.length === 0) {
          throw new Error("A pasta está vazia ou não contém arquivos suportados (PDF/Docs/TXT).");
       }

       let combinedContent = `--- ARQUIVOS EXTRAÍDOS DA PASTA DO CLIENTE ---\n\n`;
       toast({ title: "Lendo Textos", description: `Extraindo conteúdo de ${files.length} arquivos...` });
       
       for (const file of files) {
          combinedContent += `\n>> ARQUIVO: ${file.name}\n`;
          try {
             const text = await readDriveFileParams(file.id, token, file.mimeType);
             combinedContent += `${text && text.trim() ? text : "[Arquivo sem texto extraível ou formato bloqueado]"}\n`;
          } catch (err) {
             combinedContent += `[Erro ao ler conteúdo: ${err.message}]\n`;
          }
       }

       setAiContext(combinedContent);
       toast({ title: "Leitura Concluída!", description: "Os arquivos foram copiados para a Inteligência Artificial com sucesso." });

    } catch (e) {
       console.error("Erro no Drive:", e);
       toast({ variant: "destructive", title: "Erro na Leitura do Drive", description: e.message });
    } finally {
       setIsScanningDrive(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando detalhes...</div>;
  if (!client) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cliente não encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="text-slate-400 hover:text-white gap-2 pl-0">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </Button>

        {/* Client Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{client.nome}</h1>
                <p className="text-slate-400 font-mono text-sm">{client.cpf}</p>
                
                {/* Asaas Integration Badge */}
                <div className="mt-2 flex items-center gap-2">
                  {client.asaas_customer_id ? (
                    <span className="inline-flex items-center gap-1 bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded border border-green-800">
                       <CreditCard className="w-3 h-3" /> Asaas: {client.asaas_customer_id}
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSyncAsaas}
                      disabled={syncing}
                      className="h-7 text-xs border-indigo-500/50 text-indigo-400 hover:bg-indigo-900/20"
                    >
                      {syncing ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                      Sincronizar Asaas
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" /> {client.telefone}
              </div>
              <div className="flex items-center justify-end gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" /> {client.email}
              </div>
              <div className="flex items-center justify-end gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" /> {client.endereco || "Endereço não cadastrado"}
              </div>
            </div>
          </div>
          
          {informacoesCaso?.documentos && (
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium flex items-center gap-2"><Folder className="w-4 h-4 text-blue-400" /> Pasta de Documentos</h3>
                <p className="text-sm text-slate-400">Google Drive verificado para acesso automatizado.</p>
              </div>
              <div className="flex gap-2">
                 <Button onClick={handleScanDrive} disabled={isScanningDrive} className="bg-purple-600 hover:bg-purple-700 text-white gap-2 border-0">
                   {isScanningDrive ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                   {isScanningDrive ? "Lendo Drive..." : "Escanear com IA"}
                 </Button>
                 <Button onClick={() => window.open(informacoesCaso.documentos, '_blank')} variant="outline" className="border-slate-700 text-slate-300 hover:text-white gap-2">
                   <ExternalLink className="w-4 h-4" /> Acessar
                 </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JusBrasil Integration */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-400" /> Integração JusBrasil
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Acesse o JusBrasil para pesquisar e copiar andamentos processuais.
              </p>
              <Button onClick={handleJusBrasilSearch} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <ExternalLink className="w-4 h-4 mr-2" /> Abrir JusBrasil
              </Button>
              
              <div className="border-t border-slate-800 pt-4 mt-4">
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Colar Andamentos (Processamento Automático)
                </label>
                <textarea 
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-md p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                  placeholder="Cole aqui o texto dos andamentos copiados do JusBrasil..."
                  value={pasteData}
                  onChange={(e) => setPasteData(e.target.value)}
                />
                <Button onClick={handleParseAndamentos} variant="secondary" className="mt-2 w-full">
                  Processar Texto
                </Button>
              </div>

              {parsedUpdates.length > 0 && (
                <div className="mt-4 space-y-2 bg-slate-950 p-4 rounded-md border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 uppercase">Pré-visualização de Dados</h3>
                  {parsedUpdates.map((update) => (
                    <div key={update.id} className="text-sm border-l-2 border-indigo-500 pl-3 py-1">
                      <p className="text-white">{update.text}</p>
                      {update.explanation && (
                        <div className="mt-1 flex items-start gap-2 text-xs text-indigo-300 bg-indigo-900/20 p-2 rounded">
                          <HelpCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span><strong>{update.explanation.term}:</strong> {update.explanation.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Processes List with Explanations */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Processos Ativos
            </h2>
            
            {processes.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum processo cadastrado.</p>
            ) : (
              <div className="space-y-4">
                {processes.map((proc) => {
                  const statusExplanation = getTermExplanation(proc.status);
                  const descExplanation = getTermExplanation(proc.descricao);

                  return (
                    <div key={proc.id} className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-slate-500">{proc.numero_processo}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                               <span className={`px-2 py-0.5 rounded-full text-xs border cursor-help ${
                                  proc.status === 'Ativo' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                  'bg-slate-800 border-slate-700 text-slate-300'
                                }`}>
                                  {proc.status}
                                </span>
                            </TooltipTrigger>
                            {statusExplanation && (
                              <TooltipContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-xs">
                                <p className="font-bold mb-1">{statusExplanation.term}</p>
                                <p>{statusExplanation.explanation}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <h3 className="font-medium text-white mb-2">{proc.descricao}</h3>
                      
                      {descExplanation && (
                        <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-800/50 mb-3">
                           <HelpCircle className="w-3 h-3 mt-0.5 text-indigo-400 flex-shrink-0" />
                           <span>
                             <strong className="text-indigo-400">{descExplanation.term}:</strong> {descExplanation.explanation}
                           </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800">
                        <span>Tribunal: {proc.tribunal}</span>
                        <span>•</span>
                        <span>Atualizado: {new Date(proc.data_atualizacao).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
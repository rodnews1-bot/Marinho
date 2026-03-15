import React from 'react';
import { useClient } from '@/context/ClientContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, User, FolderOpen, DollarSign, BookOpen, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProcessosList from '@/components/dashboard/ProcessosList';
import FinanceiroSection from '@/components/dashboard/FinanceiroSection';
import InformacoesCaso from '@/components/dashboard/InformacoesCaso';
import PrintableDocument from '@/components/dashboard/PrintableDocument';

const ClientDashboard = () => {
  const { client, logout, loading } = useClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5565992823630', '_blank');
  };

  const handleSchedule = () => {
    window.open('https://calendar.google.com/calendar/appointments/schedules/AcZssZ05LQBaGSMp19S1g1pQyxfnE5wQBnvoKBO2XmzKCqbKNYm0hIJ0oz1ySTgDHDzlwjBSq1NEKUe7', '_blank');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!client) {
    return <Navigate to="/client-login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/30">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-semibold text-white leading-tight text-sm sm:text-base truncate max-w-[150px] sm:max-w-md">{client.nome}</h1>
              <p className="text-xs text-slate-500 font-mono">{client.cpf}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-900/20 gap-2 px-2 sm:px-4"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 no-print">
          <Button 
            onClick={handleSchedule}
            className="h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-400/20 shadow-lg shadow-blue-900/20 w-full"
          >
            <Calendar className="w-5 h-5 mr-3 text-white" />
            <span className="text-sm sm:text-base font-bold">Agendar Reunião</span>
          </Button>
          <Button 
            onClick={handleWhatsApp}
            className="h-12 sm:h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border border-green-400/20 shadow-lg shadow-green-900/20 w-full"
          >
            <MessageCircle className="w-5 h-5 mr-3 text-white" />
            <span className="text-sm sm:text-base font-bold">WhatsApp do Especialista</span>
          </Button>
        </div>

        <PrintableDocument title={`Relatório do Cliente: ${client.nome}`}>
          <div className="space-y-6 sm:space-y-8">
            <div className="no-print">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Painel de Controle</h2>
            </div>

            <Tabs defaultValue="processos" className="w-full">
              <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full bg-slate-900 border border-slate-800 mb-6 sm:mb-8 no-print h-auto gap-2 sm:gap-0 p-1 rounded-xl">
                <TabsTrigger value="processos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white w-full py-3 justify-center rounded-lg transition-all duration-300">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  <span>Processos</span>
                </TabsTrigger>
                <TabsTrigger value="financeiro" className="data-[state=active]:bg-green-600 data-[state=active]:text-white w-full py-3 justify-center rounded-lg transition-all duration-300">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Financeiro</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white w-full py-3 justify-center rounded-lg transition-all duration-300">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Informações</span>
                </TabsTrigger>
              </TabsList>

              {/* Sections wrapped for Print Visibility Logic */}
              <div className="grid grid-cols-1 gap-8 print:block">
                <TabsContent value="processos" className="m-0 print:block focus-visible:outline-none ring-0">
                  <div className="bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-800 print:border-0 print:p-0 print:bg-white min-h-[300px]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 print:text-black">
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                      Andamentos Processuais
                    </h3>
                    {/* Ensure filtering passes ONLY the current client ID */}
                    <ProcessosList clienteId={client.id} />
                  </div>
                </TabsContent>

                <TabsContent value="financeiro" className="m-0 print:block focus-visible:outline-none ring-0">
                   <div className="bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-800 print:border-0 print:p-0 print:bg-white min-h-[300px]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 print:text-black">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Débitos e Honorários
                    </h3>
                    <FinanceiroSection clienteId={client.id} />
                  </div>
                </TabsContent>

                <TabsContent value="info" className="m-0 print:block focus-visible:outline-none ring-0">
                   <div className="bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-800 print:border-0 print:p-0 print:bg-white min-h-[300px]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 print:text-black">
                      <BookOpen className="w-5 h-5 text-amber-500" />
                      Informações do Caso
                    </h3>
                    <InformacoesCaso clienteId={client.id} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </PrintableDocument>
      </main>
    </div>
  );
};

export default ClientDashboard;
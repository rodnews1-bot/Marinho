import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, LogOut, Shield } from 'lucide-react';
import AdminClientes from './sections/AdminClientes';
import AdminFinanceiro from './sections/AdminFinanceiro';

const AdminDashboard = () => {
  const { isAdmin, currentUser, logout, loading } = useAdmin();

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-wide text-sm sm:text-base">MARINHO <span className="text-indigo-400">ADMIN</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">{currentUser?.name || 'Administrador'}</div>
              <div className="text-xs text-slate-500">{currentUser?.email || 'admin@marinhoadvocacia.com'}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-red-400 hover:bg-red-950/30">
              <LogOut className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="clientes" className="w-full flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Tabs List */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0 w-full">
              <TabsTrigger 
                value="clientes" 
                className="w-full justify-start px-4 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:bg-slate-900 border border-transparent data-[state=active]:border-indigo-500 rounded-md transition-all text-sm"
              >
                <Users className="w-4 h-4 mr-3" /> Clientes & Processos
              </TabsTrigger>
              <TabsTrigger 
                value="financeiro" 
                className="w-full justify-start px-4 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:bg-slate-900 border border-transparent data-[state=active]:border-indigo-500 rounded-md transition-all text-sm"
              >
                <DollarSign className="w-4 h-4 mr-3" /> Financeiro
              </TabsTrigger>
            </TabsList>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <TabsContent value="clientes" className="mt-0 focus-visible:outline-none">
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400" /> Gestão de Clientes e Processos</h2>
                <AdminClientes />
              </div>
            </TabsContent>
            
            <TabsContent value="financeiro" className="mt-0 focus-visible:outline-none">
               <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2"><DollarSign className="w-5 h-5 text-indigo-400" /> Financeiro (Boletos Manuais)</h2>
                <AdminFinanceiro />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, DollarSign, Calendar, AlertCircle } from 'lucide-react';

const AdminBoletos = () => {
  const [boletos, setBoletos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cliente_id: '',
    valor: '',
    data_vencimento: '',
    descricao: '',
    numero_boleto: '',
    link_pagamento: '',
    status: 'Pendente'
  });

  const fetchData = async () => {
    setLoading(true);
    const [bolRes, cliRes] = await Promise.all([
      supabase.from('boletos').select('*'),
      supabase.from('clientes').select('*')
    ]);
    if (bolRes.data) setBoletos(bolRes.data);
    if (cliRes.data) setClientes(cliRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await supabase.from('boletos').insert([{
        ...formData,
        valor: parseFloat(formData.valor)
      }]);
      toast({ title: "Boleto manual registrado" });
      setIsModalOpen(false);
      setFormData({
        cliente_id: '',
        valor: '',
        data_vencimento: '',
        descricao: '',
        numero_boleto: '',
        link_pagamento: '',
        status: 'Pendente'
      });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este boleto manual?')) {
      await supabase.from('boletos').delete().eq('id', id);
      toast({ title: "Boleto excluído" });
      fetchData();
    }
  };

  const getClientName = (id) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium">Controle de Boletos Manuais</h3>
        <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Boleto Manual
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs uppercase bg-slate-950 text-slate-300">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Vencimento</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="p-6 text-center">Carregando...</td></tr> : boletos.length === 0 ? <tr><td colSpan="6" className="p-6 text-center">Nenhum boleto manual registrado.</td></tr> : boletos.map((boleto) => (
                <tr key={boleto.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-white">{getClientName(boleto.cliente_id)}</td>
                  <td className="px-6 py-4">{new Date(boleto.data_vencimento).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-white font-medium">R$ {parseFloat(boleto.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{boleto.descricao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      boleto.status === 'Pago' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }`}>
                      {boleto.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(boleto.id)} className="h-8 w-8 text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Boleto Manual">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Cliente</label>
            <select 
              className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              value={formData.cliente_id}
              onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
              required
            >
              <option value="">Selecione...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} - {c.cpf}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Valor (R$)</label>
                <div className="relative">
                   <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                   <Input type="number" step="0.01" required value={formData.valor} onChange={(e) => setFormData({...formData, valor: e.target.value})} className="pl-9 bg-slate-950 border-slate-800" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Vencimento</label>
                <div className="relative">
                   <Input type="date" required value={formData.data_vencimento} onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})} className="bg-slate-950 border-slate-800" />
                </div>
             </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Descrição</label>
            <Input required value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} placeholder="Ex: Honorários Jan/2026" className="bg-slate-950 border-slate-800" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">Link de Pagamento (Opcional)</label>
             <Input value={formData.link_pagamento} onChange={(e) => setFormData({...formData, link_pagamento: e.target.value})} placeholder="https://..." className="bg-slate-950 border-slate-800" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">Código de Barras / Número (Opcional)</label>
             <Input value={formData.numero_boleto} onChange={(e) => setFormData({...formData, numero_boleto: e.target.value})} className="bg-slate-950 border-slate-800" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">Status</label>
             <select 
                className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Cancelado">Cancelado</option>
              </select>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Salvar Boleto</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBoletos;
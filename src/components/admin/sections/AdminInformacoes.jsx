import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';

const AdminInformacoes = () => {
  const [info, setInfo] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cliente_id: '',
    dados_relevantes: '',
    contatos: '',
    documentos: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const [infoRes, cliRes] = await Promise.all([
      supabase.from('informacoes_caso').select('*'),
      supabase.from('clientes').select('*')
    ]);
    if (infoRes.data) setInfo(infoRes.data);
    if (cliRes.data) setClientes(cliRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await supabase.from('informacoes_caso').update(formData).eq('id', editingItem.id);
        toast({ title: "Informação atualizada" });
      } else {
        await supabase.from('informacoes_caso').insert([formData]);
        toast({ title: "Informação adicionada" });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar" });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      cliente_id: item.cliente_id,
      dados_relevantes: item.dados_relevantes,
      contatos: item.contatos,
      documentos: item.documentos
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta informação?')) {
      await supabase.from('informacoes_caso').delete().eq('id', id);
      fetchData();
    }
  };

  const getClientName = (id) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setEditingItem(null); setFormData({ cliente_id: clientes[0]?.id || '', dados_relevantes: '', contatos: '', documentos: '' }); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Nova Informação
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs uppercase bg-slate-950 text-slate-300">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Dados Relevantes</th>
                <th className="px-6 py-3">Contatos</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="4" className="p-6 text-center">Carregando...</td></tr> : info.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-white">{getClientName(item.cliente_id)}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{item.dados_relevantes}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{item.contatos}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8 text-blue-400 hover:bg-blue-400/10"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Editar Informações" : "Nova Informação"}>
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
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Dados Relevantes</label>
            <textarea 
              className="w-full min-h-[80px] rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              value={formData.dados_relevantes} 
              onChange={(e) => setFormData({...formData, dados_relevantes: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Contatos</label>
            <textarea 
              className="w-full min-h-[80px] rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              value={formData.contatos} 
              onChange={(e) => setFormData({...formData, contatos: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Documentos Necessários</label>
            <textarea 
              className="w-full min-h-[80px] rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              value={formData.documentos} 
              onChange={(e) => setFormData({...formData, documentos: e.target.value})} 
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminInformacoes;
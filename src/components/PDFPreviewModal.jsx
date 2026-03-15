import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { simplifyLegalText } from '@/lib/simplifyExplanation';
import { FileText, Wand2, CheckCircle2, AlertCircle, Edit2, Loader2 } from 'lucide-react';

const PDFPreviewModal = ({ isOpen, onClose, data, onConfirm }) => {
  const [explanation, setExplanation] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const generateExplanation = async () => {
      if (data && isOpen) {
        setIsLoadingAI(true);
        try {
          const simplified = await simplifyLegalText(data.text, data.type);
          setExplanation(simplified);
          setEditValue(simplified);
        } catch (error) {
          console.error(error);
          setExplanation("Não foi possível gerar uma explicação automática.");
        } finally {
          setIsLoadingAI(false);
        }
      }
    };

    if (isOpen && data) {
      generateExplanation();
    }
  }, [data, isOpen]);

  if (!data) return null;

  const handleSaveEdit = () => {
    setExplanation(editValue);
    setIsEditing(false);
  };

  const handleConfirm = () => {
    onConfirm({
      ...data,
      simplifiedExplanation: explanation
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Revisão do Documento">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
            <label className="text-xs text-slate-500 uppercase font-bold">Tipo Identificado</label>
            <p className="text-white font-medium">{data.type}</p>
          </div>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
            <label className="text-xs text-slate-500 uppercase font-bold">Data Extraída</label>
            <p className="text-white font-medium">{data.date}</p>
          </div>
        </div>

        {/* AI Explanation Section */}
        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-5 relative">
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-indigo-300 font-bold flex items-center gap-2">
               <Wand2 className="w-4 h-4" /> Explicação Simplificada (IA)
             </h3>
             {!isEditing && !isLoadingAI && (
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={() => setIsEditing(true)}
                 className="h-8 text-indigo-400 hover:text-white hover:bg-indigo-500/20"
               >
                 <Edit2 className="w-3 h-3 mr-1" /> Editar
               </Button>
             )}
          </div>

          {isLoadingAI ? (
            <div className="py-8 flex flex-col items-center justify-center text-indigo-300/70 gap-3">
               <Loader2 className="w-6 h-6 animate-spin" />
               <p className="text-sm">Traduzindo juridiquês...</p>
            </div>
          ) : isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full h-32 bg-slate-950 border border-indigo-500/30 rounded-md p-3 text-sm text-indigo-100 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8">Cancelar</Button>
                <Button size="sm" onClick={handleSaveEdit} className="h-8 bg-indigo-600 hover:bg-indigo-700">Salvar Edição</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-indigo-100 leading-relaxed">
              {explanation}
            </p>
          )}
        </div>

        {/* Original Text Preview (Collapsed/Scrollable) */}
        <div>
           <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Texto Original (Extraído)</label>
           <div className="bg-slate-950 border border-slate-800 rounded-md p-3 max-h-40 overflow-y-auto text-xs text-slate-400 font-mono">
             {data.text}
           </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar e Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PDFPreviewModal;
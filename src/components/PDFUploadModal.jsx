import React, { useState, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { processPDF } from '@/lib/pdfProcessor';
import { UploadCloud, FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PDFUploadModal = ({ isOpen, onClose, onProcessComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Apenas arquivos PDF são permitidos.");
      return;
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("O arquivo é muito grande (Máximo 10MB).");
      return;
    }

    setFile(file);
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const data = await processPDF(file);
      onProcessComplete({ file, ...data });
      // Reset state for next time
      setFile(null);
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao processar PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Documento PDF">
      <div className="space-y-6">
        <div 
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'}
            ${error ? 'border-red-500/50 bg-red-500/5' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="application/pdf"
            onChange={handleFileSelect}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 text-slate-400"
              >
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                </div>
                <p className="font-medium text-slate-300">Clique para selecionar ou arraste um PDF aqui</p>
                <p className="text-xs text-slate-500">Máximo 10MB • Apenas PDF</p>
              </motion.div>
            ) : (
              <motion.div 
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-red-900/20 rounded-xl flex items-center justify-center border border-red-900/50">
                   <FileText className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white max-w-[250px] truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute -top-4 -right-4 text-slate-400 hover:text-red-400"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="text-red-400 text-sm flex items-center gap-2 bg-red-900/10 p-3 rounded-md border border-red-900/20">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleProcess} 
            disabled={!file || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 min-w-[140px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extraindo...
              </>
            ) : (
              "Processar PDF"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PDFUploadModal;
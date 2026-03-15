import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const PrintableDocument = ({ title, children }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-container">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" /> Imprimir Documento
        </Button>
      </div>
      
      {/* Print Header - Visible only on print */}
      <div className="hidden print:block mb-8 border-b border-gray-300 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black uppercase">Marinho Advocacia</h1>
            <p className="text-sm text-gray-600">Relatório Jurídico e Financeiro</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>{new Date().toLocaleDateString()}</p>
            <p>rodrigomarinho.com.br</p>
          </div>
        </div>
      </div>

      <div className="printable-content">
        {title && <h2 className="text-xl font-bold mb-6 text-black print:block hidden">{title}</h2>}
        {children}
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>Este documento é confidencial e protegido por sigilo advocatício.</p>
      </div>
    </div>
  );
};

export default PrintableDocument;
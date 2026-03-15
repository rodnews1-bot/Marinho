import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useClient } from '@/context/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { formatCPF, cleanCPF } from '@/lib/cpfUtils';

const ClientLogin = () => {
  const [cpf, setCpf] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastSearchedCPF, setLastSearchedCPF] = useState('');
  
  const { loginWithCPF } = useClient();
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Apply visual mask only
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate length of numbers only
    const cleanValue = cleanCPF(cpf);
    
    if (cleanValue.length !== 11) {
      setError("CPF incompleto. Digite os 11 números.");
      return;
    }
    
    setLastSearchedCPF(cleanValue);
    setIsSubmitting(true);
    
    try {
      // Calls the generic login context function which queries the DB for any matching CPF
      const success = await loginWithCPF(cleanValue);
      if (success) {
        navigate('/client-dashboard');
      } else {
        // More friendly error for clients
        setError(`CPF ${cleanValue} não encontrado.`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Não foi possível realizar o login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 z-0" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Button 
          variant="ghost" 
          className="mb-8 text-slate-400 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao site
        </Button>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Área do Cliente</h1>
            <p className="text-slate-400 text-sm">Acesse seus processos e informações financeiras com segurança.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">CPF</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleChange}
                  maxLength={14}
                  className={`pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg tracking-wider font-mono ${error ? 'border-red-500/50' : ''}`}
                  required
                />
              </div>
              {error && (
                <div className="bg-red-950/30 border border-red-900/50 rounded p-3 mt-2">
                   <div className="text-red-400 text-xs flex items-center gap-1 font-bold">
                      <AlertCircle className="w-3 h-3" /> {error}
                   </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-900/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </div>
              ) : (
                'Acessar Painel'
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Acesso restrito. Seus dados são protegidos por criptografia de ponta a ponta.
                <br />
                <span className="text-slate-600 mt-2 block">Seu CPF deve estar previamente cadastrado pelo escritório.</span>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientLogin;
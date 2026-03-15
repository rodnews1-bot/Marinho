import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { cleanCPF } from '@/lib/cpfUtils';

const ClientContext = createContext();

export const useClient = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for persisted session
    const persistedClient = localStorage.getItem('marinho_client_session');
    if (persistedClient) {
      setClient(JSON.parse(persistedClient));
    }
    setLoading(false);
  }, []);

  // Real-time synchronization simulation
  // In a real Supabase app, we would use supabase.channel().subscribe()
  // Here, we poll for updates to the current client's data
  useEffect(() => {
    if (!client?.id) return;

    const intervalId = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('id', client.id)
          .single();

        if (error) {
           console.error('[ClientContext] Sync error:', error);
           return;
        }

        if (data) {
          // Check if data actually changed to avoid unnecessary re-renders or loops
          if (JSON.stringify(data) !== JSON.stringify(client)) {
             setClient(data);
             localStorage.setItem('marinho_client_session', JSON.stringify(data));
             console.log('[ClientContext] Data synced with server');
          }
        } else {
             // If client was deleted from DB but session exists, logout
             console.warn('[ClientContext] Client no longer exists in DB');
             logout();
        }
      } catch (err) {
        console.error('[ClientContext] Sync exception', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [client?.id]);

  const validateCPF = (cpf) => {
    // Validates if it has 11 digits (clean)
    const cleaned = cleanCPF(cpf);
    return cleaned.length === 11;
  };

  const loginWithCPF = async (cpfInput) => {
    // 1. Clean the input
    const cleanedCPF = cleanCPF(cpfInput);
    console.log(`[Login] Attempt - Input: "${cpfInput}" -> Cleaned: "${cleanedCPF}"`);

    // 2. Validation
    if (!validateCPF(cleanedCPF)) {
      console.warn("[Login] Invalid CPF format");
      toast({
        variant: "destructive",
        title: "CPF Inválido",
        description: "O CPF deve conter 11 dígitos numéricos.",
      });
      return false;
    }

    setLoading(true);
    try {
      // 3. Query DB
      console.log(`[Login] Querying DB for CPF: ${cleanedCPF}`);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('cpf', cleanedCPF);

      if (error) {
        console.error('[Login] DB Error:', error);
        throw error;
      }

      console.log('[Login] Query Result:', data);

      if (data && data.length > 0) {
        const clientData = data[0];
        setClient(clientData);
        localStorage.setItem('marinho_client_session', JSON.stringify(clientData));
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a), ${clientData.nome}.`,
        });
        return true;
      } else {
        console.warn(`[Login] CPF ${cleanedCPF} not found in DB.`);
        throw new Error("CPF não encontrado");
      }
    } catch (error) {
      console.error('[Login] Exception:', error);
      toast({
        variant: "destructive",
        title: "Erro no acesso",
        description: error.message === "CPF não encontrado" 
          ? `CPF não encontrado. Entre em contato com o escritório.` 
          : "Erro ao conectar. Tente novamente.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setClient(null);
    localStorage.removeItem('marinho_client_session');
    toast({
      title: "Desconectado",
      description: "Você saiu da área do cliente.",
    });
  };

  return (
    <ClientContext.Provider value={{ client, loginWithCPF, logout, loading }}>
      {children}
    </ClientContext.Provider>
  );
};
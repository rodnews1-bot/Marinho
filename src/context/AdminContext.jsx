import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { restoreAdminSession, signInAdmin, signOutAdmin } from '@/lib/adminAuth';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // A sessão guardada só vale depois de conferida com o servidor
    let ativo = true;
    restoreAdminSession()
      .then((sessao) => {
        if (!ativo) return;
        if (sessao) {
          setIsAdmin(true);
          setCurrentUser({ name: 'Rodrigo Moreira Marinho', email: sessao.email });
        }
      })
      .catch(() => {})
      .finally(() => ativo && setLoading(false));
    return () => { ativo = false; };
  }, []);

  const login = async (email, password) => {
    const resultado = await signInAdmin(email, password).catch(() => ({ ok: false, error: 'Sem conexão com o servidor. Tente de novo.' }));
    if (resultado.ok) {
      setIsAdmin(true);
      setCurrentUser({ name: 'Rodrigo Moreira Marinho', email: resultado.session.email });
      toast({
        title: "Login de Administrador",
        description: "Acesso concedido com sucesso.",
      });
      return true;
    }
    toast({
      variant: "destructive",
      title: "Acesso Negado",
      description: resultado.error || "Credenciais inválidas.",
    });
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    signOutAdmin();
    toast({
      title: "Desconectado",
      description: "Sessão de administrador encerrada.",
    });
  };

  return (
    <AdminContext.Provider value={{ isAdmin, currentUser, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
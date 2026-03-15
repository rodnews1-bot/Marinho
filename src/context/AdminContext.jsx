import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for persisted admin session
    const token = localStorage.getItem('marinho_admin_token');
    if (token === 'valid_admin_token') {
      setIsAdmin(true);
      // Restore user info (mock)
      setCurrentUser({
        name: 'Rodrigo Moreira Marinho',
        email: 'contato@rodrigomarinho.com.br'
      });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Updated credentials as requested
    if (email === 'contato@rodrigomarinho.com.br' && password === 'Vencedor23*#') {
      setIsAdmin(true);
      const user = {
        name: 'Rodrigo Moreira Marinho',
        email: email
      };
      setCurrentUser(user);
      localStorage.setItem('marinho_admin_token', 'valid_admin_token');
      
      toast({
        title: "Login de Administrador",
        description: "Acesso concedido com sucesso.",
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Credenciais inválidas.",
      });
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('marinho_admin_token');
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
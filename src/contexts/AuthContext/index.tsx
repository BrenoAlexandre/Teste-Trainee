import { AxiosError, AxiosResponseHeaders } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '../../interfaces';
import toastMsg, { ToastType } from '../../utils/toastMsg';

interface IContextUser {
  id: string;
  name: string;
  role: string;
}

interface IContextLogin {
  data: IUser;
  headers: AxiosResponseHeaders;
}

interface AuthContextData {
  logged: boolean;
  user: IContextUser;
  token: string;
  Login({ data, headers }: IContextLogin): void;
  Logout(): void;
}

// Criando o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Hook do context
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

// Crinado o componente que retorna o Provider e suas funções
export const AuthProvider = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  const [user, setUser] = useState<IContextUser>({ id: '', name: '', role: '' });
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const localToken = localStorage.getItem('TOKEN_KEY');
    const localUser = localStorage.getItem('USER');

    if (localToken && localUser) {
      setToken(localToken);
      setUser(JSON.parse(localUser));
    }
  }, []);

  function Login({ data, headers }: IContextLogin): void {
    try {
      localStorage.clear();
      setToken(headers.authorization);
      setUser({ id: data.id, name: data.name, role: data.role });

      localStorage.setItem('TOKEN_KEY', `Bearer ${headers.authorization}`);
      localStorage.setItem('USER', JSON.stringify({ id: data.id, name: data.name, role: data.role }));
    } catch (error) {
      toastMsg(ToastType.Error, (error as AxiosError).response?.data || 'Internal Server Error!');
    }
  }

  function Logout(): void {
    setToken('');
    setUser({ id: '', name: '', role: '' });

    localStorage.clear();
  }

  return (
    <AuthContext.Provider value={{ logged: !!token, user, token, Login, Logout }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

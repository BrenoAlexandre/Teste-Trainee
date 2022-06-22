import { AxiosResponseHeaders } from 'axios';
import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useState } from 'react';
import { IUser } from '../../interfaces';
import HttpClient from '../../services/httpClient';
import setTokenStorage from '../../utils/setTokenStorage';

interface AuthContextData {
  signed: boolean;
  user: IUser | null;
  Login({ data, headers }: { data: IUser; headers: AxiosResponseHeaders }): Promise<boolean>;
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
  const [user, setUser] = useState<IUser | null>(null);

  async function Login({ data, headers }: { data: IUser; headers: AxiosResponseHeaders }): Promise<boolean> {
    setTokenStorage('TOKEN_KEY', `Bearer ${headers.authorization}`);

    const decoded = await jwtDecode<Promise<IUser>>(headers.authorization);

    if (decoded) {
      HttpClient.api.defaults.headers.common.authorization = `Bearer ${headers.authorization}`;

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      if (!user) return false;

      return true;
    }

    return false;
  }

  async function Logout(): Promise<void> {
    setTokenStorage('TOKEN_KEY');
    setUser(null);
  }

  return <AuthContext.Provider value={{ signed: Boolean(user), user, Login, Logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;

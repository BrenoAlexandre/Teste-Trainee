import { AxiosResponseHeaders } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '../../interfaces';
import HttpClient from '../../services/httpClient';
import checkTokenIsValid from '../../utils/checkTokenIsValid';
import getTokenStorage from '../../utils/getTokenStorage';
import setTokenStorage from '../../utils/setTokenStorage';

interface AuthContextData {
  user: IUser | null;
  isValid(): boolean;
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

  useEffect(() => {
    const storagedToken = getTokenStorage();

    if (storagedToken) {
      HttpClient.api.defaults.headers.common.authorization = storagedToken;
    }
  }, []);

  function isValid(): boolean {
    if (!checkTokenIsValid('TOKEN_KEY')) {
      return false;
    }

    return true;
  }

  async function Login({ data, headers }: { data: IUser; headers: AxiosResponseHeaders }): Promise<boolean> {
    const token = setTokenStorage('TOKEN_KEY', headers.authorization);

    if (checkTokenIsValid('TOKEN_KEY')) {
      HttpClient.api.defaults.headers.common.authorization = token;

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

  return <AuthContext.Provider value={{ isValid, user, Login, Logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;

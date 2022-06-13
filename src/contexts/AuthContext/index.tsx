import React, { createContext, useContext } from 'react';
import { IUser } from '../../interfaces';
import { IAuthContext, IAuthProvider } from './interfaces';

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function useAuth(): IAuthContext {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: IAuthProvider): React.ReactElement => {
  function hasAuth(): boolean {
    const token = localStorage.getItem('TOKEN_KEY');
    if (token) {
      return true;
    }
    return false;
  }

  function logout(): void {
    localStorage.clear();
  }

  function getUser(): IUser {
    const user = localStorage.getItem('user');

    if (!user) {
      throw new Error('No user found in ls');
    }

    const formattedUser = JSON.parse(user);

    const { role } = JSON.parse(user);
    if (role === 'admin') {
      return formattedUser;
    }

    return formattedUser;
  }

  const value = {
    hasAuth,
    logout,
    getUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

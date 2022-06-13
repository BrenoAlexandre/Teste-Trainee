import React from 'react';
import { IUser } from '../../interfaces';

export interface IAuthContext {
  hasAuth: () => boolean;
  logout: () => void;
  getUser: () => IUser;
}

export interface IAuthProvider {
  children: React.ReactElement;
}

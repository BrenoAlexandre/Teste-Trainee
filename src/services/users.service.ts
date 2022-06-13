import HttpClient from './httpClient';
import { IUser } from '../interfaces';
import ERole from '../enums/ERole';

class UsersService {
  static async users(): Promise<IUser[]> {
    const { data } = await HttpClient.api.get<IUser[]>('api/v1/users');
    return data;
  }

  static async user(id: string): Promise<IUser> {
    const { data } = await HttpClient.api.get(`api/v1/users/${id}`);
    return data;
  }

  static async create(user: {
    name: string;
    cpf: string;
    birthdate: Date;
    role: ERole;
    obs: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    const { data } = await HttpClient.api.post('api/v1/users', user);
    return data;
  }

  static async update(
    id: string,
    user: {
      name: string;
      cpf: string;
      birthdate: Date;
      role: ERole;
      obs: string;
    }
  ): Promise<void> {
    const { data } = await HttpClient.api.put(`api/v1/users/${id}`, user);
    return data;
  }

  static async delete(id: string): Promise<string> {
    const { statusText } = await HttpClient.api.delete(`api/v1/users/${id}`);
    return statusText;
  }

  static async login(cpf: string, password: string): Promise<IUser> {
    const { headers, data } = await HttpClient.api.post('api/v1/users/authenticate', { cpf, password });

    if (!headers || !headers.authorization) {
      throw new Error('No token found');
    }

    HttpClient.api.defaults.headers.common.Authorization = headers.authorization;
    localStorage.setItem('TOKEN_KEY', headers.authorization);
    return data;
  }
}

export default UsersService;

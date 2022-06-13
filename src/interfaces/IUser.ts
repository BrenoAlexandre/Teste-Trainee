import ERole from '../enums/ERole';

export interface IUser {
  id: string;
  name: string;
  cpf: string;
  birthdate: Date;
  role: ERole;
  obs: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

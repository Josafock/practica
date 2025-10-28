export interface User {
  id: number;
  nombre: string;
  email: string;
  phone?: string;
}

export interface LoginResponse {
  msg: string;
  token: string;
  usuario: User;
}

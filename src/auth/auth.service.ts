import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Simula um usuário na aplicação
  private readonly users = [{ username: 'usuario', password: 'senha' }];

  // Verifica se o usuário e senha são válidos
  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    return user;
  }
}

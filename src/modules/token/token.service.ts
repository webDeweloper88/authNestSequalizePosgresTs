// token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwtToken(user) {
    try {
      const payload = { user };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('SECRET_JWT'),
        expiresIn: this.configService.get<string>('EXPIRE_JWT'),
      });
    } catch (error) {
      // Обработка ошибки
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate JWT token');
    }
  }
}

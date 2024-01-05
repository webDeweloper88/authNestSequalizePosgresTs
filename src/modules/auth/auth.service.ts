import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/createUserDTO';
import { AuthUserResponse } from './respons';
import { AppError } from 'src/common/constans/errors';
import { UserLoginDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(dto: CreateUserDTO): Promise<AuthUserResponse> {
    const userEmail = await this.userService.findUserByEmail(dto.email);
    if (userEmail) throw new BadRequestException(AppError.USER_EXIST);
    await this.userService.createUser(dto);
    return this.userService.publicUser(dto.email);
  }

  async login(dto: UserLoginDTO): Promise<AuthUserResponse> {
    const userEmail = await this.userService.findUserByEmail(dto.email);
    if (!userEmail) throw new BadRequestException(AppError.USER_NOT_EXIST);
    const validatePassword = await bcrypt.compare(
      dto.password,
      userEmail.password,
    );
    if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);
    return this.userService.publicUser(dto.email);
  }
}

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from '../auth/respons';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from './dto/createUserDTO';
import { AppError } from 'src/common/constans/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly tokenService: TokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: {
          email: email,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      dto.password = await this.hashPassword(dto.password);
      const newUser = {
        firstName: dto.firstName,
        userName: dto.userName,
        email: dto.email,
        password: dto.password,
      };
      await this.userRepository.create(newUser);
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async publicUser(email: string): Promise<AuthUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = await this.tokenService.generateJwtToken(user);

      const response: AuthUserResponse = {
        user: {
          firstName: user.firstName,
          userName: user.userName,
          email: user.email,
        },
        token,
      };

      return response;
    } catch (error) {
      if (error.name === 'EntityNotFound') {
        throw new NotFoundException('User not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // async updateUser(userId: number, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
  //   try {
  //     await this.userRepository.update(dto, { where: { id: userId } });
  //     return dto;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }
  async updateUser(userId: number, dto: UpdateUserDTO): Promise<User> {
    try {
      await this.userRepository.update(dto, { where: { id: userId } });
      // Получаем актуальные данные пользователя после обновления
      const updatedUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return updatedUser;
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(
          "Ma'lumotlar bazasida bunday Email allaqachon mavjud",
        );
      }

      // Используйте более конкретное исключение, если нужно
      throw new InternalServerErrorException(
        `Foydalanuvchini yangilab bo‘lmadi: ${e.message}`,
      );
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { id },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async updatePassword(userId: number, dto: UpdatePasswordDTO): Promise<any> {
    try {
      const { password } = await this.findUserById(userId);
      const currentPassword = await bcrypt.compare(dto.oldPassword, password);
      if (!currentPassword) return new BadRequestException(AppError.WRONG_DATA);
      const newPassword = await this.hashPassword(dto.newPassword);
      const data = {
        password: newPassword,
      };
      return this.userRepository.update(data, { where: { id: userId } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await this.userRepository.destroy({ where: { id } });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}

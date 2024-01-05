import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/createUserDTO';
import { AuthUserResponse } from './respons';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('API')
  @ApiResponse({
    status: 201,
    description: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi.",
    type: AuthUserResponse,
  })
  @ApiResponse({
    status: 400,
    description:
      'So‘rov noto‘g‘ri. Xuddi shu elektron pochta manziliga ega foydalanuvchi allaqachon mavjud.',
  })
  @Post('register')
  async register(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<AuthUserResponse> {
    return await this.authService.registerUser(createUserDTO);
  }

  @ApiTags('API')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Avtorizatsiya muvaffaqiyatli',
    type: AuthUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "login yoki parol noto'g'ri",
  })
  @Post('login')
  async login(@Body() userLoginDTO: UserLoginDTO): Promise<AuthUserResponse> {
    return await this.authService.login(userLoginDTO);
  }
}

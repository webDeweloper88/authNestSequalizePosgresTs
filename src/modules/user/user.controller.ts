import {
  Controller,
  Put,
  UseGuards,
  Param,
  Body,
  BadRequestException,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-guards';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDTO, UpdateUserDTO } from './dto/createUserDTO';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('API')
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'User not found or update failed' })
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    try {
      // Обновляем пользователя и получаем обновленные данные
      const updatedUser = await this.userService.updateUser(
        userId,
        updateUserDTO,
      );
      // Проверяем, успешно ли прошло обновление
      if (updatedUser) {
        return {
          message: 'Foydalanuvchi muvaffaqiyatli yangilandi',
          data: updatedUser,
        };
      } else {
        return { message: 'Foydalanuvchi topilmadi yoki yangilanmadi' };
      }
    } catch (error) {
      return { message: `Failed to update user: ${error.message}` };
    }
  }

  @ApiTags('API')
  @Put(':id/update-password')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to update password' })
  async updatePassword(
    @Param('id') userId: number,
    @Body() updatePasswordDTO: UpdatePasswordDTO,
  ) {
    try {
      // Обновляем пароль пользователя
      await this.userService.updatePassword(userId, updatePasswordDTO);

      return { message: 'Password updated successfully' };
    } catch (error) {
      // Обработка ошибок
      if (error instanceof BadRequestException) {
        throw new BadRequestException({ message: error.message });
      } else {
        throw new BadRequestException({
          message: 'Failed to update password',
        });
      }
    }
  }

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() request): Promise<boolean> {
    const user = request.user;
    return this.userService.deleteUser(user.id);
  }
}

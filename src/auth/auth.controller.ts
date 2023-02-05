import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * CREATE USER (REGISTER)
   * @param createUserDto
   * @returns
   */
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User was created',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * AUTH USER (LOGIN)
   * @param loginUserDto
   * @returns
   */
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('superadmin-page')
  @Auth(ValidRoles.superAdmin)
  testPrivateRoute1(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Area privada',
      user,
    };
  }

  @Get('admin-page')
  @Auth(ValidRoles.admin, ValidRoles.superAdmin)
  testPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Area privada',
      user,
    };
  }

  @Get('guest-page')
  @Auth(ValidRoles.guest, ValidRoles.admin, ValidRoles.superAdmin)
  testPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Area privada',
      user,
    };
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * CREATE USER SERVICE (REGISTER)
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJsonWebToken({ id: user.id }),
      };
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  /**
   * LOGIN USER
   * @param loginUserDto
   */
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user) throw new UnauthorizedException('Credenciales erróneas (email)');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales erróneas (password)');
    return {
      ...user,
      token: this.getJsonWebToken({ id: user.id }),
    };
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }

  //check auth status for revalidate tken
  async checkAuthStatus(user: User) {
    const {
      card_club,
      create_pin,
      address,
      telefono,
      roles,
      cc_aa,
      ...userRest
    } = user;

    return {
      ...userRest,
      token: this.getJsonWebToken({ id: userRest.id }),
    };
  }

  /**get jsonwebtoken */
  private getJsonWebToken(payload: JWTPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  /** control errors duplicates or not data into required fields */
  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs!!');
  }
}

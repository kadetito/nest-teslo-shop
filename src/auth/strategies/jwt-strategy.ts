import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JWTPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepositiory: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepositiory.findOneBy({ id });
    if (!user) throw new UnauthorizedException('Token no valid');
    if (!user.isActive)
      throw new UnauthorizedException('User inactive. Impossible access!!');
    return user;
  }
}

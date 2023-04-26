import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    public configService: ConfigService,
  ) {}

  async register(userDto: CreateUserDto) {
    try {
      const user = await this.userService.create(userDto);

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto);
    const token = await this.signJwtToken(user);

    return {
      email: user.email,
      ...token,
    };
  }

  async validateUser(email) {
    console.log(email);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private async signJwtToken(user) {
    const accessToken = await this.jwtService.signAsync(
      { user },
      {
        expiresIn: 3600,
        secret: this.configService.get('SECRET_KEY'),
      },
    );
    return { accessToken };
  }
}

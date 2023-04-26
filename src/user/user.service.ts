import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(userDto: CreateUserDto): Promise<any> {
    const salt = bcrypt.genSaltSync(10);
    userDto.password = await bcrypt.hashSync(userDto.password, salt);
    const userInDb = await this.userRepository.findByCondition({
      email: userDto.email,
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.create(userDto);
  }
  async findByLogin({ email, password }: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findByCondition({
      email: email,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = bcrypt.compareSync(password, user.password);
    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
  async findByEmail(email: string): Promise<any> {
    return await this.userRepository.findByCondition({
      email: email,
    });
  }
}

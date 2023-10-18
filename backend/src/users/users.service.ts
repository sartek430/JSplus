import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserInfos } from 'src/decorators/user.decorator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 8),
    });

    delete user.password;

    return this.usersRepository.save(user);
  }

  async findAll(inputQuery: ObjectLiteral): Promise<User[]> {
    const query: ObjectLiteral = {};

    const qb = this.usersRepository.createQueryBuilder('user');

    if (!!inputQuery.name) qb.where('user.name LIKE :name', { name: `%${inputQuery.name}%` });
    if (!!inputQuery.email) qb.andWhere('user.email LIKE :email', { email: `%${inputQuery.email}%` });

    const users = await qb.getMany();

    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findBy({ email });

    return user[0];
  }

  async update(updateUserDto: UpdateUserDto, user: IUserInfos) {
    const userToUpdate = await this.usersRepository.findOne({ where: { id: user.id } });
    if (!userToUpdate) throw new Error('User not found');

    const updatedUser = await this.usersRepository.save({ ...userToUpdate, ...updateUserDto });

    return updatedUser;
  }
}

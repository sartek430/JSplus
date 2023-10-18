import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserInfos } from 'src/decorators/user.decorator';
import * as bcrypt from 'bcrypt';
import { ContactsService } from 'src/contacts/contacts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(ContactsService) private contactsService: ContactsService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 8),
    });

    const existingUser = await this.usersRepository.findBy({ email: user.email });
    if (existingUser.length > 0) throw new ForbiddenException(['Email already used']);

    const newUser = await this.usersRepository.save(user);
    delete newUser.password;

    return newUser;
  }

  async findAll(inputQuery: ObjectLiteral, user: IUserInfos): Promise<User[]> {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email'])
      .leftJoinAndSelect('user.widgets', 'widget')

    if (!!inputQuery.name) qb.where('user.name LIKE :name', { name: `%${inputQuery.name}%` });
    if (!!inputQuery.email) qb.andWhere('user.email LIKE :email', { email: `%${inputQuery.email}%` });

    const contacts = await this.contactsService.findAll(user);

    const users = (await qb.getMany()).map((userFound) => {
      const contact = contacts.find((contact) => contact.userIdA === userFound.id || contact.userIdB === userFound.id);

      if (!contact) delete userFound.widgets;

      return userFound;
    });

    return users;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findBy({ email });

    return user[0];
  }

  async update(updateUserDto: UpdateUserDto, user: IUserInfos) {
    const userToUpdate = await this.usersRepository.findOne({ where: { id: user.id } });
    if (!userToUpdate) throw new ForbiddenException(['User not found']);

    if (updateUserDto.password) updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 8);

    const updatedUser = await this.usersRepository.save({ ...userToUpdate, ...updateUserDto, id: user.id });

    return updatedUser;
  }
}

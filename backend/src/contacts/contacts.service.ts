import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { IUserInfos } from 'src/decorators/user.decorator';

@Injectable()
export class ContactsService {
  constructor(@InjectRepository(Contact) private invitsRepository: Repository<Contact>) { }

  create(data: { userIdA: number, userIdB: number }) {
    return this.invitsRepository.save(data);
  }

  findAll(user: IUserInfos) {
    const qb = this.invitsRepository
      .createQueryBuilder('contact')
      .select(['contact.id', 'contact.userIdA', 'contact.userIdB'])
      .where('contact.userIdA = :userId', { userId: user.id })
      .orWhere('contact.userIdB = :userId', { userId: user.id });

    return qb.getMany();
  }

  remove(id: number, user: IUserInfos) {
    const qb = this.invitsRepository
      .createQueryBuilder('contact')
      .delete()
      .where('contact.id = :id', { id })
      .andWhere('contact.userIdA = :userId', { userId: user.id })
      .orWhere('contact.userIdB = :userId', { userId: user.id });

    return qb.execute();
  }
}

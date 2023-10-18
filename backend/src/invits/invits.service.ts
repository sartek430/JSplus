import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactsService } from 'src/contacts/contacts.service';
import { IUserInfos } from 'src/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateInvitDto } from './dto/create-invit.dto';
import { UpdateInvitDto } from './dto/update-invit.dto';
import { Invit } from './entities/invit.entity';
import { EInvitStatus } from './models';

@Injectable()
export class InvitsService {
  constructor(
    @InjectRepository(Invit) private invitsRepository: Repository<Invit>,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(ContactsService) private readonly contactService: ContactsService
  ) { }

  async create(createInvitDto: CreateInvitDto, user: IUserInfos) {
    const userFound = await this.userService.findOneByEmail(createInvitDto.email);

    if (!userFound) throw new ForbiddenException(['User not found']);
    if (userFound.id === user.id) throw new ForbiddenException(['You can\'t invite yourself']);

    const existingInvitQb = this.invitsRepository
      .createQueryBuilder('invit')
      .where('invit.senderId = :senderId', { senderId: user.id })
      .andWhere('invit.receiverId = :receiverId', { receiverId: userFound.id });
    const existingInvit = await existingInvitQb.getOne();

    if (existingInvit) throw new ForbiddenException(['Invit already sent']);

    const alreadyInvitedQb = this.invitsRepository
      .createQueryBuilder('invit')
      .where('invit.senderId = :senderId', { senderId: userFound.id })
      .andWhere('invit.receiverId = :receiverId', { receiverId: user.id });
    const alreadyInvited = await alreadyInvitedQb.getOne();

    if (alreadyInvited) throw new ForbiddenException(['User already invited you']);

    const alreadyContactQb = await this.contactService.findAll(user);
    const alreadyContact = alreadyContactQb.find(contact => contact.userIdA === userFound.id || contact.userIdB === userFound.id);

    if (alreadyContact) throw new ForbiddenException(['User already in your contacts']);

    return this.invitsRepository.save({
      senderId: user.id,
      receiverId: userFound.id,
      status: EInvitStatus.PENDING
    });
  }

  async update(id: number, updateInvitDto: UpdateInvitDto, user: IUserInfos) {
    const invit = await this.invitsRepository.findOne({ where: { id } });

    if (!invit || invit.receiverId !== user.id) throw new ForbiddenException(['Invit not found']);
    if (invit.status !== EInvitStatus.PENDING) throw new ForbiddenException(['Invit already answered']);

    if (updateInvitDto.status === EInvitStatus.ACCEPTED) {
      this.contactService.create({
        userIdA: invit.senderId,
        userIdB: invit.receiverId
      });
    }

    return this.invitsRepository.save({ ...invit, ...updateInvitDto });
  }

  findAll(user: IUserInfos) {
    return this.invitsRepository.find({ where: { receiverId: user.id } });
  }
}

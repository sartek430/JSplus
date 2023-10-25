import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "./entities/contact.entity";
import { Repository } from "typeorm";
import { IUserInfos } from "src/decorators/user.decorator";

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private invitsRepository: Repository<Contact>,
  ) {}

  create(data: { userIdA: number; userIdB: number }) {
    return this.invitsRepository.save(data);
  }

  findAll(user: IUserInfos) {
    const qb = this.invitsRepository
      .createQueryBuilder("contact")
      .select(["contact.id", "contact.userIdA", "contact.userIdB"])
      .where("contact.userIdA = :userId", { userId: user.id })
      .orWhere("contact.userIdB = :userId", { userId: user.id });

    return qb.getMany();
  }

  async remove(id: number, user: IUserInfos) {
    const contact = await this.findAll(user);

    if (!contact || !contact.length || !contact.find((c) => c.id === id))
      throw new ForbiddenException([
        "You are not allowed to delete this contact",
      ]);

    return this.invitsRepository.delete(id);
  }
}

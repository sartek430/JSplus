import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from 'src/contacts/contacts.module';
import { UsersModule } from 'src/users/users.module';
import { Invit } from './entities/invit.entity';
import { InvitsController } from './invits.controller';
import { InvitsService } from './invits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invit]), UsersModule, ContactsModule],
  controllers: [InvitsController],
  providers: [InvitsService],
})
export class InvitsModule {}

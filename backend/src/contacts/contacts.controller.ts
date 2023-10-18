import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IUserInfos, UserInfos } from 'src/decorators/user.decorator';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@UserInfos() user: IUserInfos) {
    return this.contactsService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserInfos() user: IUserInfos) {
    return this.contactsService.remove(+id, user);
  }
}

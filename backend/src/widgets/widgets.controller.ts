import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IUserInfos, UserInfos } from 'src/decorators/user.decorator';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { WidgetsService } from './widgets.service';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWidgetDto: CreateWidgetDto, @UserInfos() user: IUserInfos) {
    return this.widgetsService.create(createWidgetDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@UserInfos() user: IUserInfos) {
    return this.widgetsService.findAll(user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWidgetDto: UpdateWidgetDto) {
  //   return this.widgetsService.update(+id, updateWidgetDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserInfos() user: IUserInfos) {
    return this.widgetsService.remove(+id, user);
  }
}

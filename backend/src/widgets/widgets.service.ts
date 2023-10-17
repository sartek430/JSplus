import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserInfos } from 'src/decorators/user.decorator';
import { Repository } from 'typeorm';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { Widget } from './entities/widget.entity';

@Injectable()
export class WidgetsService {
  constructor(@InjectRepository(Widget) private widgetsRepository: Repository<Widget>) { }

  create(createWidgetDto: CreateWidgetDto, user: IUserInfos) {
    const widget = this.widgetsRepository.create(createWidgetDto);
    widget.user = { id: user.id } as any;

    return this.widgetsRepository.save(widget);
  }

  async findAll(user: IUserInfos) {
    const w = await this.widgetsRepository.find({ where: { user: { id: user.id } } });

    return w;
  }

  // update(id: number, updateWidgetDto: UpdateWidgetDto) {
  //   return `This action updates a #${id} widget`;
  // }

  remove(id: number, user: IUserInfos) {
    return this.widgetsRepository.delete({ id, user: user as any });
  }
}

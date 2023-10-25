import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Widget } from './entities/widget.entity';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Widget]), UsersModule],
  controllers: [WidgetsController],
  providers: [WidgetsService],
})
export class WidgetsModule {}

import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EWidgetSize } from "../models";

@Entity()
export class Widget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "float" })
  latitude: number;

  @Column({ type: "float" })
  longitude: number;

  @Column({ length: 20 })
  size: EWidgetSize;

  @ManyToOne(() => User, (user) => user.widgets)
  user: User;
}

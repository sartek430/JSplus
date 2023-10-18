import { Widget } from "src/widgets/entities/widget.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 500 })
  password: string;

  @OneToMany(() => Widget, (widget) => widget.user)
  widgets: Widget[];

}

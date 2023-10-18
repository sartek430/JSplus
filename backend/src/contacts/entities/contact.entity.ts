import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userIdA: number;
  
  @Column()
  userIdB: number;
}

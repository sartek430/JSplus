import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EInvitStatus } from "../models";

@Entity('invits')
export class Invit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @Column({ default: EInvitStatus.PENDING })
  status: EInvitStatus;
}

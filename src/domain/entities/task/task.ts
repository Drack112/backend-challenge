import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user";

export enum STATUS_TASK {
  PENDENTE = "Pendente",
  EM_PROGRESSO = "Em Progresso",
  CONCLUIDO = "Concluído",
}

export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  status: STATUS_TASK;
  user: User;
}

@Entity("task")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: "enum",
    enum: STATUS_TASK,
  })
  status!: STATUS_TASK;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user!: User;

  toResultObject(): TaskDTO {
    const { createdAt, updatedAt, ...resultObject } = this;
    return resultObject;
  }
}

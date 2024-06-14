import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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

  toResultObject(): TaskDTO {
    const { createdAt, updatedAt, ...resultObject } = this;
    return resultObject;
  }
}

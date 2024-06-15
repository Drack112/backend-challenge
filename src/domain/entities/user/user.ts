import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  JoinColumn,
} from "typeorm";

import * as bcrypt from "bcryptjs";
import { Task } from "../task/task";

export interface UserDTO {
  id: string;
  username: string;
  tasks?: Task[];
}

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  username!: string;

  @Column()
  private password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Task, task => task.user)
  @JoinColumn()
  tasks!: Task[];

  toResultObject(): UserDTO {
    const { password, createdAt, updatedAt, ...resultObject } = this;
    return resultObject;
  }

  async comparePassword(attempt: string) {
    const compared = await bcrypt.compare(attempt, this.password);
    if (!compared) {
      return Promise.reject();
    }
    return compared;
  }
}

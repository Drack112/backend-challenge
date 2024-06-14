import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";

import * as bcrypt from "bcryptjs";

export interface UserDTO {
  id: string;
  username: string;
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

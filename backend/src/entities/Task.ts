import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskType } from "../utils";
import User from "./User";

registerEnumType(TaskType, { name: "TaskType" });

@Entity("Task")
@ObjectType("Task")
class Task extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  description: string;

  @Column("enum", { enum: TaskType })
  @Field(() => TaskType)
  type: TaskType;

  @Column({ type: "timestamptz" })
  @Field()
  startTime: string;

  @Column()
  @Field(() => Number)
  timeTaken: number;

  @CreateDateColumn({ type: "timestamptz" })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field(() => Date)
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @Field(() => User)
  createdBy: User;
}

export default Task;

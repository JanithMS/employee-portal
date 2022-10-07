import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../utils";

registerEnumType(UserRole, { name: "UserRole" });

@Entity("User")
@ObjectType("User")
class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  mailId: string;

  @Column()
  password: string;

  @Column()
  @Field()
  contactNumber: string;

  @Column()
  @Field()
  department: string;

  @Column({ type: "timestamptz" })
  @Field()
  joiningDate: string;

  @Column("enum", { enum: UserRole })
  @Field(() => UserRole)
  role: UserRole;

  @CreateDateColumn({ type: "timestamptz" })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field(() => Date)
  updateAt: Date;
}

export default User;

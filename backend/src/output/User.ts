import { Field, ObjectType } from "type-graphql";
import User from "../entities/User";

@ObjectType()
class GetEmployeesOutput {
  @Field(() => [User], { nullable: true })
  list: User[];

  @Field(() => Number)
  count: number;
}

export { GetEmployeesOutput };

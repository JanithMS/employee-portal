import { Field, ObjectType } from "type-graphql";
import Task from "../entities/Task";

@ObjectType()
class GetTasksOutput {
  @Field(() => [Task], { nullable: true })
  list: Task[];

  @Field(() => Number)
  count: number;
}

export { GetTasksOutput };

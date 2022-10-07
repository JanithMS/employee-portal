import { Field, InputType } from "type-graphql";
import { TaskType } from "../utils";

@InputType()
class CreateTaskInput {
  @Field()
  description: string;

  @Field(() => TaskType)
  type: TaskType;

  @Field()
  startTime: string;

  @Field(() => Number)
  timeTaken: number;
}

export { CreateTaskInput };

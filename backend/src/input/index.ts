import { Field, InputType } from "type-graphql";

@InputType()
class PaginationInput {
  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}

export { PaginationInput };

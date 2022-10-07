import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
class LoginInput {
  @Field()
  mailId: string;

  @Field()
  password: string;
}

@InputType()
class CreateEmployeeInput {
  @Field()
  name: string;

  @Field()
  @IsEmail()
  mailId: string;

  @Field()
  contactNumber: string;

  @Field()
  department: string;

  @Field()
  joiningDate: string;
}

export { LoginInput, CreateEmployeeInput };

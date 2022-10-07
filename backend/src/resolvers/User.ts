import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserInputError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CreateEmployeeInput, LoginInput } from "../input/User";
import MyContext from "../utils/context";
import User from "../entities/User";
import { autoGenPass, UserRole } from "../utils";
import { PaginationInput } from "../input";
import { GetEmployeesOutput } from "../output/User";

@Resolver(() => User)
class UserResolver {
  @Mutation(() => User)
  async login(
    @Arg("LoginInputs") { mailId, password }: LoginInput,
    @Ctx() { res }: MyContext
  ) {
    try {
      const user = await User.findOneOrFail({ where: { mailId } });
      if (!user) throw new UserInputError("Account Not Found");

      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass) throw new UserInputError("Invalid Credential");

      const jwtToken = jwt.sign(user.id, process.env.JWT_SECRET!);

      // Send the cookie in response & return `user`
      res.cookie("token", jwtToken);
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => User)
  async createEmployee(
    @Arg("CreateEmployeeInput") createEmployeeInput: CreateEmployeeInput
  ) {
    try {
      //Autogenerating the password
      const password =
        process.env.NODE_ENV === "production" ? autoGenPass(8) : "123456";

      // Hash the password
      const passHashed = await bcrypt.hash(password, 13);

      // Store in database
      const user = await User.create({
        ...createEmployeeInput,
        password: passHashed,
        role: UserRole.EMPLOYEE,
      }).save();

      // TODO: Create Mailing Service
      process.env.NODE_ENV === "production"
        ? console.log("Mail Sent")
        : console.log(password);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => GetEmployeesOutput)
  @Authorized([UserRole.ADMIN])
  async getEmployees(
    @Arg("PaginationInput") { skip, take }: PaginationInput
  ): Promise<GetEmployeesOutput> {
    try {
      const employees = await User.find({
        where: { role: UserRole.EMPLOYEE },
        order: { name: "ASC" },
        skip,
        take,
      });

      const employeesCount = await User.count({
        where: { role: UserRole.EMPLOYEE },
      });

      return { list: employees, count: employeesCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => User)
  @Authorized()
  async getMe(@Ctx() { user }: MyContext) {
    return user;
  }
}

export default UserResolver;

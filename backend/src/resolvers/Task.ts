import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import MyContext from "../utils/context";
import { PaginationInput } from "../input";
import Task from "../entities/Task";
import { CreateTaskInput } from "../input/Task";
import { GetTasksOutput } from "../output/Task";
import User from "../entities/User";

@Resolver(() => Task)
class TaskResolver {
  @Authorized()
  @Mutation(() => Task)
  async createTask(
    @Arg("CreateTaskInput") createTaskInput: CreateTaskInput,
    @Ctx() { user }: MyContext
  ) {
    try {
      const task = await Task.create({
        ...createTaskInput,
        createdBy: user,
      }).save();

      return task;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Authorized()
  @Query(() => GetTasksOutput)
  async getTask(
    @Arg("PaginationInput") { skip, take }: PaginationInput,
    @Ctx() { user }: MyContext
  ): Promise<GetTasksOutput> {
    try {
      const tasks = await Task.find({
        where: { createdBy: { id: user.id } },
        order: { startTime: "ASC" },
        skip,
        take,
        relations: ["createdBy"],
      });

      const taskCount = await Task.count();

      return { list: tasks, count: taskCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  @FieldResolver(() => User)
  async createdBy(@Root() { id, createdBy }: Task) {
    if (createdBy) return createdBy;

    const task = await Task.findOneOrFail({
      where: { id },
      relations: ["createdBy"],
    });

    return task.createdBy;
  }
}

export default TaskResolver;

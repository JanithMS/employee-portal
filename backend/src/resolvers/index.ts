// Import all your resolvers hereu

import TaskResolver from "./Task";
import UserResolver from "./User";

export default [UserResolver, TaskResolver] as const;

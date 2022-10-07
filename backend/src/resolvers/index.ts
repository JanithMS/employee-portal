// Import all your resolvers hereu

import { Query, Resolver } from "type-graphql";

@Resolver()
class InitResolver {
  @Query(() => String)
  init() {
    return "Server is Running";
  }
}

export default [InitResolver] as const;

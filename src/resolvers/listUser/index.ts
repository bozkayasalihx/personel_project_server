import { User } from "../../entities/User";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class listUserResolve {
    @Query(() => [User])
    listUser(): Promise<User[]> {
        return User.find({});
    }
}




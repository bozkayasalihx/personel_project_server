import { MyContext } from "../../types";
import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entities/User";

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext) {
        const id = ctx.req.session.userId;
        const user = await User.findOne(id);

        if (!user) {
            return null;
        }

        return user;
    }
}

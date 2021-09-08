import { Post } from "../../entities/Post";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class DeletePostResolver {
    @Mutation(() => Boolean, { nullable: true })
    async deletePost(@Arg("id") id: number) {
        try {
            const post = await Post.findOne(id);

            if (!post) {
                return null;
            }
            await Post.remove(post);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

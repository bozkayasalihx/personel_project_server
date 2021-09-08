import { Post } from "../../entities/Post";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class CreatePostResolver {
    @Mutation(() => Post)
    async createPost(@Arg("title") title: string, @Arg("body") body: string) {
        const post = Post.create({ title, body });

        try {
            await post.save();
            return post;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

import { Post } from "../../entities/Post";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class ListPostResolver {
    @Query(() => [Post])
    async listPosts() {
        const posts = await Post.find({});
        return posts;
    }

    @Query(() => Post, { nullable: true })
    async getPost(@Arg("id") id: number) {
        const post = await Post.findOne(id);
        if (!post) {
            return null;
        }

        return post;
    }
}

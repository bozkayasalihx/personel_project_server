import { Post } from "../../entities/Post";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class UpdatePostResolver {
    @Mutation(() => Boolean, { nullable: true })
    async updatePost(
        @Arg("id") id: number,
        @Arg("newTitle") newTitle: string,
        @Arg("newBody", { nullable: true }) newBody?: string
    ) {
        try {
            let post;
            if (newBody) {
                post = await Post.update(id, {
                    title: newTitle,
                    body: newBody,
                });
            }

            post = await Post.update(id, { title: newTitle });

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

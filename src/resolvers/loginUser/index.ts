import { User } from "../../entities/User";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { isEmail } from "class-validator";
import { validate } from "../../utils/validate";
import { UserResponse } from "../registerUser/UserInput";
import { MyContext } from "../../types";

@InputType()
class LoginInput {
    @Field()
    usernameOrEmail: string;

    @Field()
    password: string;
}

@Resolver()
export class LoginUserResolver {
    @Mutation(() => Boolean)
    async loginUser(
        @Arg("loginInput") options: LoginInput
        // @Ctx() { req }: MyContext
    ) {
        const valid = validate(options.password, options.usernameOrEmail);
        // some validtions
        if (!valid[options.password]) {
            return {
                errors: [
                    { field: "password", message: "invalid password length" },
                ],
            };
        }

        if (!valid[options.usernameOrEmail]) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "username or email not valid",
                    },
                ],
            };
        }
        const validEmail = isEmail(options.usernameOrEmail);

        const user = await User.findOne({
            where: {
                email: options.usernameOrEmail,
                username: options.usernameOrEmail,
            },
        });

        console.log(user);
        return true;
        //     if (!validEmail) {
        //         // usenameOrEmail == username;
        //         const username = options.usernameOrEmail;

        //         const user = await User.findOne({ where: { username } });

        //         if (!user) {
        //             return {
        //                 errors: [
        //                     {
        //                         field: "username",
        //                         message: "true", // for the hacker attacks
        //                     },
        //                 ],
        //             };
        //         }
        //     } else {
        //         // not valid which is stands for usernameOrEmail === email
        //         const email = options.usernameOrEmail;
        //         const user = await User.findOne({ where: { email } });

        //         if (!user) {
        //             return {
        //                 errors: [
        //                     {
        //                         field: "email",
        //                         message: "true",
        //                     },
        //                 ],
        //             };
        //         }
        //     }

        //     req.session.userId = user.id;
        // }
    }
}

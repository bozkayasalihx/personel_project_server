import argon2 from "argon2";
import { isEmail } from "class-validator";
import { callback } from "../../utils/callback";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";
import { User } from "../../entities/User";
import { validate } from "../../utils/validate";
import { UserResponse } from "../registerUser/UserInput";

@InputType()
class LoginInput {
    @Field()
    usernameOrEmail: string;

    @Field()
    password: string;
}

@Resolver()
export class LoginUserResolver {
    @Mutation(() => UserResponse)
    async loginUser(
        @Arg("loginInput") options: LoginInput
        // @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        // some validtions
        const valid = validate(options.password, options.usernameOrEmail);
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

        const cb = async (user: User) => {
            if (!user) {
                return {
                    errors: [
                        { field: "username", message: "username not found" },
                    ],
                };
            }
            // check password is correct;
            const valid = await argon2.verify(user.password, options.password);
            if (!valid) {
                return {
                    errors: [
                        { field: "password", message: "password not correct" },
                    ],
                };
            }

            return null;
        };
        const user = await callback(options.usernameOrEmail, cb);

        // const validEmail = isEmail(options.usernameOrEmail);
        // let user;
        // if (validEmail) {
        //     user = await User.findOne({
        //         where: { email: options.usernameOrEmail },
        //     });

        //

        //     return {
        //         user,
        //     };
        // } else {
        //     user = await User.findOne({
        //         where: { username: options.usernameOrEmail },
        //     });

        //     if (!user) {
        //         return {
        //             errors: [
        //                 { field: "usrname", message: "username not found" },
        //             ],
        //         };
        //     }

        //     return {
        //         user,
        //     };
        // }

        return {
            user,
        };
    }
}

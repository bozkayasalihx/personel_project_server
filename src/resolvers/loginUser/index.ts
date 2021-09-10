import argon2 from "argon2";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";
import { callback } from "../../utils/callback";
import { validate } from "../../utils/validate";
import { UserResponse } from "../registerUser/UserInput";

@InputType()
export class LoginInput {
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

        const userResponse = await callback(
            options.usernameOrEmail,
            async user => {
                console.log("user: ", user);

                const valid = await argon2.verify(
                    user.password,
                    options.password
                );

                console.log("is valid: ",  valid)

                if (!valid) {
                    return {
                        errors: [
                            { field: "password", message: "password wrong" },
                        ],
                    };
                } else {
                    return { user };
                }
            }
        );

        return userResponse;
    }
}

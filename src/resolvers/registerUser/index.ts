import argon2 from "argon2";
import { isEmail } from "class-validator";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entities/User";
import { validate } from "../../utils/validate";
import { UserInput, UserResponse } from "./UserInput";

@Resolver()
export class UserRegisterResolver {
    @Mutation(() => UserResponse)
    async registerUser(
        @Arg("userInput") options: UserInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const validEmail = isEmail(options.email);
        const isvalid = validate(options.password, options.username);

        // validation the user;
        if (!validEmail) {
            return {
                errors: [{ field: "email", message: "email not valid" }],
            };
        }

        if (!isvalid[options.username]) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "username not valid",
                    },
                ],
            };
        }

        if (!isvalid[options.password]) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "password not valid",
                    },
                ],
            };
        }

        const SECRET_SALT_KEY = "knfflfhkjnvk";

        const hashedPassword = await argon2.hash(options.password, {
            salt: Buffer.from(SECRET_SALT_KEY),
        });

        console.log(hashedPassword);

        const user = User.create({
            username: options.username,
            email: options.email,
            password: hashedPassword,
        });

        try {
            await user.save();
        } catch (err) {
            if (err.code === "23505" || err.detals.contains("already exists")) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "this username already taken",
                        },
                    ],
                };
            }
        }

        req.session.userId = user.id;

        return {
            user,
        };
    }
}

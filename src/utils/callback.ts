import { isEmail } from "class-validator";
import { UserResponse } from "src/resolvers/registerUser/UserInput";
import { User } from "../entities/User";
type Cb = (user: User) => Promise<UserResponse>;

export async function callback(usernameOrEmail: string, cb: Cb) {
    const validEmail = isEmail(usernameOrEmail);
    let user;
    if (validEmail) {
        user = await User.findOneOrFail({ where: { email: usernameOrEmail } });
    } else {
        user = await User.findOneOrFail({
            where: { username: usernameOrEmail },
        });
    }

    const userResponse = await cb(user);
    return userResponse;
}

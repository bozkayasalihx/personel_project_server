import { isEmail } from "class-validator";
import { User } from "../entities/User";

export async function callback(usernameOrEmail: string, cb: Function) {
    const validEmail = isEmail(usernameOrEmail);
    let user;
    if (validEmail) {
        user = await User.findOne({ where: { email: usernameOrEmail } });
    } else {
        user = await User.findOne({ where: { username: usernameOrEmail } });
    }

    cb();

    return user;
}

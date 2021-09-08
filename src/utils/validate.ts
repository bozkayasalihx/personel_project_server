export function validate(...args: string[]) {
    const isValid: { [x: string]: boolean } = {}

    args.forEach(arg => {
        if (arg === "") {
            return (isValid[arg] = false);
        }

        if (arg.length <= 2) {
            return (isValid[arg] = false);
        }

        return (isValid[arg] = true);
    });

    return isValid
}

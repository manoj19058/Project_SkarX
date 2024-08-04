export function checkNonSpaceString(name: unknown): boolean {
    if (
        name != null &&
        (typeof name === "string" || name instanceof String) &&
        name.length <= 30 &&
        name.length >= 3 &&
        !(
            name.indexOf(" ") >= 0 ||
            name.indexOf('"') >= 0 ||
            name.indexOf("'") >= 0
        )
    ) {
        for (let index = 0; index < name.length; index++) {
            if (
                !(
                    (name[index] >= "a" && name[index] <= "z") ||
                    (name[index] >= "A" && name[index] <= "Z")
                )
            ) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function checkEmail(email: unknown): boolean {
    const re = /\S+@\S+\.\S+/;
    if (email != null && (typeof email === "string" || email instanceof String))
        return (
            re.test(String(email)) &&
            !(
                email.indexOf('"') >= 0 ||
                email.indexOf("'") >= 0 ||
                email.indexOf(" ") >= 0
            ) &&
            email.length <= 50
        );
    return false;
}

export function checkPassword(password: unknown): boolean {
    return (
        password != null &&
        (typeof password === "string" || password instanceof String) &&
        !(password.indexOf('"') >= 0 || password.indexOf("'") >= 0) &&
        password.length >= 8 &&
        password.length <= 20
    );
}

export function checkProductName(name: unknown): boolean {
    // product, brand, order_name,
    if (
        name != null &&
        (typeof name === "string" || name instanceof String) &&
        name.trim() != "" &&
        name.length >= 3 &&
        name.length <= 50 &&
        !(name.indexOf('"') >= 0 || name.indexOf("'") >= 0)
    ) {
        for (let index = 0; index < name.length; index++) {
            if (
                !(
                    (name[index] >= "a" && name[index] <= "z") ||
                    (name[index] >= "A" && name[index] <= "Z") ||
                    (name[index] >= "0" && name[index] <= "9") ||
                    name[index] == "-" ||
                    name[index] == " "
                )
            ) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function checkNumber(num: unknown, min: number, max: number): boolean {
    // price , stock, quantity, order_quantity, order_price
    return (
        num != null &&
        !isNaN(Number(num)) &&
        Number(num) >= min &&
        Number(num) <= max
    );
}

export function checkDescription(desc: unknown): boolean {
    return (
        desc != null &&
        (typeof desc === "string" || desc instanceof String) &&
        !(desc.indexOf('"') >= 0 || desc.indexOf("'") >= 0) &&
        desc.length <= 1500 &&
        desc.length >= 10
    );
}

export function checkName(name: unknown): boolean {
    if (
        name != null &&
        (typeof name === "string" || name instanceof String) &&
        name.trim() != "" &&
        name.length <= 15 &&
        name.length >= 3 &&
        !(name.indexOf('"') >= 0 || name.indexOf("'") >= 0)
    ) {
        for (let index = 0; index < name.length; index++) {
            if (
                !(
                    (name[index] >= "a" && name[index] <= "z") ||
                    (name[index] >= "A" && name[index] <= "Z") ||
                    name[index] == " "
                )
            ) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// @ts-ignore
import {customAlphabet} from "nanoid";

export class UUID {
    static generator = customAlphabet(
        "0123456789abcdefghijklmnopqrstuvwxyz", 12
    );

    static generate(size?: number): string {
        return this.generator(size);
    }
}

import {Loader} from "../../core/UniversalPropertyLoader/Loader";
import {AuthService} from "../../services/AuthService";
import {authenticator} from "otplib";

export class AuthorizationVerify {
    static readonly TYPE = "AV";

    static readonly exported = {
        "2fa": (b, t) => this.verify2FA(b, t),
        "token": (b, t) => this.verifyToken(b, t)
    }

    static verify2FA(userBeacon: string, _2faToken: string): boolean {
        try {
            return authenticator.verify({
                token: _2faToken,
                secret: Loader.get<[string]>(["_2fakey"], userBeacon, AuthService.keys.UserDB)[0]
            });
        } catch (e) {
            throw {
                type: e.type || this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }

    // todo: crypto -> hashed password => verify
    static verifyToken(userBeacon: string, token: string): boolean {
        try {
            return Loader.get<[string]>(["token"], userBeacon, AuthService.keys.UserDB)[0] == token;
        } catch (e) {
            throw {
                type: e.type || this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }
}

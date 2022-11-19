import qrcode from "qrcode";
// @ts-ignore
import {authenticator} from "otplib";
import e from "express";
import {User} from "./User";
import {Loader} from "../core/UniversalPropertyLoader/Loader";
import {DBWorker} from "../core/UniversalPropertyLoader/wokers/impl/DBWorker";

// const SECRET = authenticator.generateSecret();
// let token = authenticator.generate(SECRET);
const SECRET = "EMRH4WZODU2ESP3C";

const USER_NAME = "test";
const SERVICE_NAME = "a service";

let qrcodeURL = authenticator.keyuri(USER_NAME, SERVICE_NAME, SECRET);

console.log(qrcodeURL);

// qrcode.toDataURL(qrcodeURL, (error, url) => {
//     if (error) {
//         console.error(error);
//         return;
//     }
//     console.log(url);
// });

// setInterval(() => {
//     console.log(authenticator.generate(SECRET));
// }, 15000);

let user1 = new User("1", "2", "3", "4", 5);

console.log(user1);

Loader.assignWorker(new DBWorker("test", "user"), "db", "user");
// if (Loader.exists("", "vn4012", "db", "user")) {
//
// }
Loader.put<[string, string, string, number]>(["token", "_2fakey", "name", "permission"], "vn4012", [
    "123", "123", "names", 5
], "db", "user");
// console.log(new User(...Loader.get<[string, string, string, string, number]>(["*"], "vn4012", "db", "user").data).__2faKey);

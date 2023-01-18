import {Entry} from "./Entry";
import path from "path";
import {JSONDriver} from "./driver/impl/JSONDriver";
import {Test} from "./test/Test";

let entry = new Entry<JSONDriver<Test>, Test>("test", new JSONDriver(), path.resolve(__dirname, "../../../stores/test"));
try {
    entry.load("1ff2e");
    entry.load("2ea");
    entry.load("this_is_not_exists");
} catch (e) {
    console.error(e);
}

console.log(entry.get("1ff2e").ga);
console.log(entry.get("2ea").vs);
entry.get("2ea").vs = true;
entry.get("1ff2e")["rvs"] = "new string";
entry.flush();

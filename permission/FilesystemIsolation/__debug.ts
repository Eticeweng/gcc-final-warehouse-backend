import fs from "fs";
import path from "path";
import {Loader} from "../../core/UniversalPropertyLoader/Loader";
import {JSONVirtualTableWorker} from "../../core/UniversalPropertyLoader/wokers/impl/JSONVirtualTableWorker";
import {IsolationInstance} from "../../services/instance/IsolationInstance";

// let s = {allowLevels: {}, excludeLevels: []};
Loader.assignWorker(new JSONVirtualTableWorker("isolations"), "json_iso");
Loader.operate<any, any>((instance: any) => console.log(instance), "json_iso");
Loader.get<[any]>([""], "debug", "json_iso");

Loader.set<[string[]]>(["excludeLevels"], "nftm", [["E:/dd", "F:/aa"]], "json_iso");
Loader.put<[{}, []]>(["allowLevels", "excludeLevels"], "debugX", [{}, []], "json_iso");

console.log(Loader.get<[{}]>(["allowLevels"], "nftm", "json_iso").at(0));
// Loader.get()
Loader.close();



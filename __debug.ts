import {NavigationService} from "./services/NavigationService";
import {Loader} from "./core/UniversalPropertyLoader/Loader";
import {YAMLWorker} from "./core/UniversalPropertyLoader/wokers/impl/YAMLWorker";

Loader.assignWorker(new YAMLWorker("fsnav"), "static", "fsnav");
console.log(JSON.stringify(NavigationService.assignNavigation("vn4012", "2m2ff2").data));

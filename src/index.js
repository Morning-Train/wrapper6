import config from "./config";
import {promisify, resolve} from "./promises";
import {Scope, createScope, queryObject} from "./scope";
import {definePackage, requireDependencies, wrapAll} from "./packages";
import {Module, useModule} from "./modules";
import {ready} from "./dom";

export {
    config,
    promisify,
    resolve,
    queryObject,
    createScope as scope,
    definePackage as define,
    requireDependencies as require,
    wrapAll as run,
    useModule as use,
    ready,
    Scope,
    Module
};
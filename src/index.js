import config from "./config";
import {promisify, promises} from "./promises";
import {Scope, createScope, queryObject} from "./scope";
import {define, requireDependencies} from "./packages";
import {Module, useModule} from "./modules";
import {ready} from "./dom";

export {
    config,
    promisify,
    promises,
    queryObject,
    createScope as scope,
    define,
    requireDependencies as resolve,
    useModule as use,
    ready,
    Scope,
    Module
};
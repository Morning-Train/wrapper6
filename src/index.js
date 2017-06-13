import config from "./config";
import {promisify, resolve} from "./promises";
import {Scope, createScope, queryObject} from "./scope";
import {define, requireDependencies} from "./packages";
import {Module, useModule} from "./modules";
import {ready} from "./dom";

export {
    config,
    promisify,
    resolve,
    queryObject,
    createScope as scope,
    define,
    requireDependencies as require,
    useModule as use,
    ready,
    Scope,
    Module
};
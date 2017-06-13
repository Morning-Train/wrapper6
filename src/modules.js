/*
 |--------------------------------------------------------------------------
 | Module wrapper
 |--------------------------------------------------------------------------
 |
 |
 |
 */

import {define} from "./packages";
export {
    useModule,
    Module
};

/**
 * Module loader
 *
 * @param name
 * @param moduleClass
 * @returns {Promise.<TResult>}
 */
function useModule(name, moduleClass) {
    if (arguments.length === 1) {
        moduleClass = name;
        name = null;
    }

    // create module
    let module = new moduleClass();

    return (typeof name === "string") ?
        define(name, module.boot.bind(module)) :
        define(module.boot.bind(module));
}

/**
 * Module base class
 */
class Module {
    boot() {
    }

    ready() {
    }
}
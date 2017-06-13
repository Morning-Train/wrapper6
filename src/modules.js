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

    // Wrapper methods
    function boot() {
        if (typeof module.boot === "function") {
            return module.boot.apply(module, arguments);
        }
    }

    function ready() {
        if (typeof module.ready === "function") {
            return module.ready.apply(module, arguments);
        }
    }

    return (typeof name === "string") ?
        define(name, boot).then(ready) :
        define(boot).then(ready);
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
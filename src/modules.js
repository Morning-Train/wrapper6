/*
 |--------------------------------------------------------------------------
 | Module wrapper
 |--------------------------------------------------------------------------
 |
 |
 |
 */

import {define} from "./packages";
import {Promise} from "es6-promise";
import {promisify} from "./promises";

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
    let module = new moduleClass(),
        bootResponse;

    // Wrapper methods
    function boot() {
        let initialResponse = typeof module.boot === "function" ? module.boot() : null;

        if (initialResponse === false) {
            return false;
        }

        return initialResponse instanceof Promise ?
            initialResponse.then((response) => {
                bootResponse = response;
                return module;

            }) : module;
    }

    function ready() {
        if (typeof module.ready === "function") {
            return module.ready(bootResponse);
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

/*
 -------------------------------
 Exports
 -------------------------------
 */

export {
    useModule,
    Module
};

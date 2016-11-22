/*
Dependencies
 */

import ReactiveMap from "./reactive-map";
import Module from "./module";
import Symbol from "es6-symbol";
import Map from "es6-map";

/*
Symbols
 */

const
    _options = Symbol("options"),
    _factories = Symbol("factories"),
    _bindings = Symbol("bindings"),
    _ready = Symbol("ready"),
    _deprecated = Symbol("deprecated");

export default class Application {

    constructor( options = {} ) {
        this[_options] = new ReactiveMap(options);
        this[_factories] = [];
        this[_bindings] = new Map();
        this[_ready] = false;
    }

    /**
     * Query the options passed to the application
     *
     * @param {String} query
     * @param defaultValue
     * @returns {*}
     */

    option( query, defaultValue = null ) {
        return this.options.get(query, defaultValue);
    }

    /**
     * Options set
     * @returns {*}
     */

    get options() {
        return this[_options];
    }

    /**
     * Registers a module
     *
     * @param name
     * @param factory
     * @returns {*}
     */
    use( name, factory ) {
        // Decide arguments
        if (typeof name === "function") {
            factory = name;
            name = null;
        }

        // Validate factory
        if (typeof factory !== "function") {
            throw new Error("The module factory can only be a function.");
        }

        this[_factories].push({
            name: name,
            factory: factory
        });
    }

    /**
     * Bootstraps the app
     */

    boot() {

        var instances = [];

        this[_factories].forEach(( module ) => {

            // Create instance
            var instance = new module.factory(app);

            // Set binding
            if (typeof module.name === "string") {
                this[_bindings].set(module.name, instance);

                // Define getter
                if (!this.hasOwnProperty(module.name)) {
                    Object.defineProperty(this, module.name, {
                        get: () => {
                            return this[_bindings].get(module.name);
                        }
                    });
                }
            }

            // Boot instance
            if (typeof instance.boot === "function") {
                instance.boot(this);
            }

            // Register for ready
            instances.push(instance);

        });

        // Ready up
        instances.forEach(( instance ) => {
            if (typeof instance.ready === "function") {
                instance.ready(this);
            }
        });

        // Ready up application
        this[_ready] = true;
    }

    /*
    Helper to check if app is ready
     */

    get ready() {
        return this[_ready];
    }

}
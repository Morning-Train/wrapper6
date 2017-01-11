/*
 Dependencies
 */

import ReactiveMap from "./reactive-map";
import Symbol from "es6-symbol";
import Map from "es6-map";
import {Promise} from "es6-promise";
import {promisify, resolve} from "./utils";

/*
 Symbols
 */

const
    _options = Symbol("options"),
    _bindings = Symbol("bindings"),
    _listeners = Symbol("listeners"),
    _factories = Symbol("factories"),
    _boot = Symbol("boot");

/*
Class
 */

export default class Application {

    /**
     * Constructor
     *
     * @param options
     */
    constructor( options = {} ) {
        this[_options] = new ReactiveMap(options);
        this[_bindings] = new Map();
        this[_listeners] = new Map();
        this[_factories] = [];

        if (document.readyState !== "complete") {
            document.addEventListener("DOMContentLoaded", () => {
                this[_factories].forEach((factoryMeta) => {
                    this[_boot](factoryMeta);
                });
            });
        }
    }

    /*
    Accessors
     */

    /**
     * Returns the option map
     *
     * @returns {ReactiveMap}
     */
    get options() {
        return this[_options];
    }

    /*
    Events
     */

    /**
     * Registers an event listener
     *
     * @param eventName
     * @param callback
     * @returns {*}
     */
    on( eventName, callback ) {
        if (typeof callback !== "function") {
            throw new Error("Invalid callback passed as application event listener!");
            return;
        }

        var events = eventName.split(" ");

        events.forEach(( eventName ) => {
            if (!this[_listeners].has(eventName)) {
                this[_listeners].set(eventName, []);
            }

            this[_listeners].get(eventName).push(callback);
        });

        return this;
    }

    /**
     * Unregisters an event listener
     *
     * @param eventName
     * @param callback
     * @returns {Application}
     */
    off( eventName, callback = null ) {
        var events = eventName.split(" ");

        events.forEach(( eventName ) => {
            if (typeof callback !== "function") {
                this[_listeners].delete(eventName);
                return;
            }

            if (this[_listeners].has(eventName)) {
                let index = this[_listeners].get(eventName).indexOf(callback);

                if (index > -1) {
                    this[_listeners].get(eventName).splice(index, 1);
                }
            }
        });

        return this;
    }

    /**
     * Triggers an event listener
     *
     * @param eventName
     * @param args
     * @returns {Application}
     */
    trigger( eventName, args = null ) {
        var events = eventName.split(" ");

        events.forEach(( eventName ) => {
            if (this[_listeners].has(eventName)) {
                this[_listeners].get(eventName).forEach(( callback ) => {
                    callback.apply(this, args instanceof Array ? args : [] );
                });
            }
        });

        return this;
    }

    /*
    Requests
     */

    /**
     * Requires a set of bindings
     *
     * @param requirements
     * @returns {Promise}
     */
    require( requirements ) {
        return new Promise(( resolve ) => {
            if (!requirements instanceof Array) {
                requirements = [ requirements ];
            }

            if (requirements.length === 0) {
                return resolve({});
            }

            var // Store solutions
                solutions = {},

                // Create event name
                eventName = requirements.map(( name ) => {
                    name = (typeof name === "string" ? name : "");
                    return `load:${name}`;

                }).join(" "),

                // Event callback
                callback = ( name, module ) => {
                    solutions[name] = module;

                    if (Object.keys(solutions).length === requirements.length) {
                        this.off(eventName, callback);
                        resolve(solutions);
                    }
                };

            // Bind event
            this.on(eventName, callback);
        });
    }

    /*
    Modularization
     */

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

        var factoryMeta = {
            name: name,
            factory: factory
        };

        this[_factories].push(factoryMeta);

        // Boot factory if document is already loaded
        if (document.readyState === "complete") {
            this[_boot] (factoryMeta);
        }
    }

    [_boot]( factoryMeta ) {
        var module = new factoryMeta.factory(this);

        promisify((typeof module.boot === "function" ? () => { return module.boot( this ) } : true)).then(( result ) => {
            // Register binding
            if (typeof factoryMeta.name === "string") {
                this[_bindings].set(factoryMeta.name, module);
            }

            // Call ready
            if (typeof module.ready === "function") {
                module.ready(this, result);
            }

            // Trigger load
            this.trigger(`load:${factoryMeta.name}`, [ factoryMeta.name, module ]);

        }).catch(( reason ) => {
            console.error(reason);
        });
    }

}
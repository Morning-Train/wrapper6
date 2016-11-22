/*
Dependencies
 */

import Symbol from "es6-symbol";

/*
Symbols
 */

const
    _app = Symbol("app");

/*
Class
 */

export default class Module {

    constructor( app ) {
        this[_app] = app;
    }

    boot( app ) {

    }

    ready( app ) {

    }

    /*
    Getters
     */

    get app() {
        return this[_app];
    }

}
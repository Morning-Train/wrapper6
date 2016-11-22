/*
 Dependencies
 */

import queryObject from "./query-object";
import Symbol from "es6-symbol";
import Map from "es6-map";

/*
 Symbols
 */

const
    _data = Symbol("data"),
    _computed = Symbol("computed"),
    _watchers = Symbol("watchers");

/*
 Class
 */

export default class ReactiveMap {

    constructor( data = {} ) {
        this[_data] = {};
        this[_computed] = new Map();
        this[_watchers] = new Map();

        // Assign data
        this.set(data);
    }

    computed( key, getter ) {
        if (key && typeof key === "object") {
            Object.keys(key).forEach((propKey) => {
                this.computed(propKey, key[propKey]);
            });

            return this;
        }

        if (typeof getter === "function") {
            this[_computed].set(key, getter);
        }

        return this;
    }

    watch( key, callback ) {
        this[_watchers].set(key, callback);

        return this;
    }

    get( query, defaultValue = null ) {
        if (arguments.length === 0) {
            return this[_data];
        }

        // Check if computed
        let head = query.split("."),
            tail = [],
            headQuery,
            getter,
            result;

        while (head.length > 0) {
            headQuery = head.join(".");
            getter = this[_computed].get(headQuery);
            if (typeof getter === "function") {
                result = getter.call(this);

                return tail.length === 0 ?
                    result :
                    queryObject(result, tail.join("."), defaultValue);
            }

            tail.push(head.pop());
        }

        return queryObject(this[_data], query, defaultValue);
    }

    set( query, value ) {
        // Check if query is an object
        if (typeof query === "object") {
            Object.keys(query).forEach((key) => {
                this.set(key, query[key]);
            });

            return this;
        }

        var parts = query.split("."),
            key = parts.pop(),
            parentQuery = parts.join("."),
            parent = parts.length === 0 ? this.get() : this.get(parentQuery),
            watcher,
            oldValue = this.get(query);

        if (!parent) {
            parent = {};
            this.set(parentQuery, parent);
        }

        parent[key] = value;

        // Trigger "*" watchers
        watcher = this[_watchers].get("*");

        if (typeof watcher === "function") {
            watcher(query, value, oldValue);
        }

        // Trigger "*" watchers of parent
        watcher = this[_watchers].get(parentQuery + ".*");

        if (typeof watcher === "function") {
            watcher(query, value, oldValue);
        }

        // Trigger specific watcher
        watcher = this[_watchers].get(query);

        if (typeof watcher === "function") {
            watcher(query, value, oldValue);
        }

        return this;
    }

    has( query ) {
        return this.get(query) !== null;
    }

    resolve( query, resolver ) {
        if (!this.has(query)) {
            this.set(query, resolver());
        }

        return this.get(query);
    }

    empty() {
        this[_data] = {};
        return this;
    }

    isEmpty() {
        return Object.keys(this[_data]).length === 0;
    }

}
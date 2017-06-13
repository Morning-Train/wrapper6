/*
 Dependencies
 */

import Symbol from "es6-symbol";
import Map from "es6-map";

export {
    queryObject,
    createScope,
    Scope
};

/*
 Scope shorthand constructor
 */

function createScope(data = {}) {
    return new Scope(data);
}

/*
 queryObject
 */

function queryObject(object, query, defaults = null) {
    var current = object,
        queryParts = query.split("."),
        part;

    if ((object === null) || (object === undefined)) {
        return defaults;
    }

    while (current && (queryParts.length > 0)) {
        part = queryParts.shift();

        if (current[part] === undefined) {
            return defaults;
        }

        current = current[part];
    }

    return current;
}

/*
 Symbols
 */

const
    _data = Symbol("data"),
    _computed = Symbol("computed"),
    _watchers = Symbol("watchers");

/*
 Scope class
 */

class Scope {

    constructor(data = {}) {
        this[_data] = {};
        this[_computed] = new Map();
        this[_watchers] = new Map();

        // Assign data
        this.set(data);
    }

    computed(key, getter) {
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

    watch(key, callback) {
        var watchers = this[_watchers].get(key);

        if (!(watchers instanceof Array)) {
            watchers = [];
            this[_watchers].set(key, watchers);
        }

        watchers.push(callback);

        return this;
    }

    get(query, defaultValue = null) {
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

    set(query, value) {
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
            watchers,
            oldValue = this.get(query);

        if (!parent) {
            parent = {};
            this.set(parentQuery, parent);
        }

        parent[key] = value;

        // Trigger "*" watchers
        watchers = this[_watchers].get("*");

        if (watchers instanceof Array) {
            watchers.forEach((watcher) => {
                watcher(query, value, oldValue);
            });
        }

        // Trigger "*" watchers of parent
        watchers = this[_watchers].get(parentQuery + ".*");

        if (watchers instanceof Array) {
            watchers.forEach((watcher) => {
                watcher(query, value, oldValue);
            });
        }

        // Trigger specific watcher
        watchers = this[_watchers].get(query);

        if (watchers instanceof Array) {
            watchers.forEach((watcher) => {
                watcher(query, value, oldValue);
            });
        }

        return this;
    }

    remove(query) {
        var parts = query.split("."),
            key = parts.pop(),
            target = parts.length > 0 ? this.get(parts.join(".")) : this.get();

        if (target && (typeof target === "object")) {
            delete target[key];
        }

        return this;
    }

    has(query) {
        return this.get(query) !== null;
    }

    resolve(query, resolver) {
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
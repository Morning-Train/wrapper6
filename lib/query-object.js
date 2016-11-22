/**
 * Query an object for a value
 *
 * @param {Object} object
 * @param {String} query
 * @param defaults
 * @returns {*}
 */

export default function queryObject( object, query, defaults = null ) {
    var current = object,
        queryParts = query.split("."),
        part;

    if ((object === null) || (object === undefined)) {
        return defaults;
    }

    while(current && (queryParts.length > 0)) {
        part = queryParts.shift();

        if (current[part] === undefined) {
            return defaults;
        }

        current = current[part];
    }

    return current;
}
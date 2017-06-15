import ee from "event-emitter";

/*
 -------------------------------
 EventEmitter
 -------------------------------
 */

class EventEmitter {
}

// - patch class
ee(EventEmitter.prototype);

/*
 -------------------------------
 Exports
 -------------------------------
 */

export {
    EventEmitter
};
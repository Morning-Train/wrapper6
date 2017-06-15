"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventEmitter = undefined;

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 -------------------------------
 EventEmitter
 -------------------------------
 */

var EventEmitter = function EventEmitter() {
  _classCallCheck(this, EventEmitter);
};

// - patch class


(0, _eventEmitter2.default)(EventEmitter.prototype);

/*
 -------------------------------
 Exports
 -------------------------------
 */

exports.EventEmitter = EventEmitter;
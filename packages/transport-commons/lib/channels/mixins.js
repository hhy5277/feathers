"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const base_1 = require("./channel/base");
const combined_1 = require("./channel/combined");
const debug = debug_1.default('@feathersjs/transport-commons:channels/mixins');
const PUBLISHERS = Symbol('@feathersjs/transport-commons/publishers');
const CHANNELS = Symbol('@feathersjs/transport-commons/channels');
const ALL_EVENTS = Symbol('@feathersjs/transport-commons/all-events');
exports.keys = {
    PUBLISHERS,
    CHANNELS,
    ALL_EVENTS
};
function channelMixin() {
    const mixin = {
        [CHANNELS]: {},
        channel(...names) {
            debug('Returning channels', names);
            if (names.length === 0) {
                throw new Error('app.channel needs at least one channel name');
            }
            if (names.length === 1) {
                const [name] = names;
                if (Array.isArray(name)) {
                    return this.channel(...name);
                }
                if (!this[CHANNELS][name]) {
                    const channel = new base_1.Channel();
                    channel.once('empty', () => {
                        channel.removeAllListeners();
                        delete this[CHANNELS][name];
                    });
                    this[CHANNELS][name] = channel;
                }
                return this[CHANNELS][name];
            }
            const channels = names.map(name => this.channel(name));
            return new combined_1.CombinedChannel(channels);
        }
    };
    return mixin;
}
exports.channelMixin = channelMixin;
function publishMixin() {
    const result = {
        [PUBLISHERS]: {},
        publish(event, callback) {
            debug('Registering publisher', event);
            if (!callback && typeof event === 'function') {
                callback = event;
                event = ALL_EVENTS;
            }
            // @ts-ignore
            if (this._serviceEvents && event !== ALL_EVENTS && this._serviceEvents.indexOf(event) === -1) {
                throw new Error(`'${event.toString()}' is not a valid service event`);
            }
            const publishers = this[PUBLISHERS];
            // @ts-ignore
            publishers[event] = callback;
            return this;
        }
    };
    return result;
}
exports.publishMixin = publishMixin;
//# sourceMappingURL=mixins.js.map
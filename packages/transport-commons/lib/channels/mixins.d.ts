import { Channel } from './channel/base';
import { HookContext } from '@feathersjs/feathers';
declare const PUBLISHERS: unique symbol;
declare const CHANNELS: unique symbol;
export declare const keys: {
    PUBLISHERS: symbol;
    CHANNELS: symbol;
    ALL_EVENTS: symbol;
};
export interface ChannelMixin {
    [CHANNELS]: {
        [key: string]: Channel;
    };
    channel(...names: string[]): Channel;
}
export declare function channelMixin(): ChannelMixin;
export interface PublishMixin {
    [PUBLISHERS]: {
        [key: string]: Channel;
    };
    publish(event: string | symbol, callback: (data: any, hook: HookContext) => Channel): any;
}
export declare function publishMixin(): PublishMixin;
export {};

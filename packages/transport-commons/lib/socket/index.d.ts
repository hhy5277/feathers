import { Application } from '@feathersjs/feathers';
import { RealTimeConnection } from '../channels/channel/base';
export interface SocketOptions {
    done: Promise<any>;
    emit: string;
    socketKey: any;
    getParams: (socket: any) => RealTimeConnection;
}
export declare function socket({ done, emit, socketKey, getParams }: SocketOptions): (app: Application<any>) => void;

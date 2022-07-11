import { DynamicModule, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import IoRedis, { RedisOptions } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Module({})
export class RedisModule implements OnModuleDestroy {
    static forRoot(port: number, host: string, options: RedisOptions): DynamicModule;
    static forRoot(path: string, options: RedisOptions): DynamicModule;
    static forRoot(port: number, options: RedisOptions): DynamicModule;
    static forRoot(port: number, host: string): DynamicModule;
    static forRoot(options: RedisOptions): DynamicModule;
    static forRoot(port: number): DynamicModule;
    static forRoot(path: string): DynamicModule;
    static forRoot(): DynamicModule;
    static forRoot(...args: any[]): DynamicModule {
        const inputArgs = args as [];
        const client = new IoRedis(...inputArgs);
        return {
            module: RedisModule,
            providers: [
                {
                    provide: REDIS_CLIENT,
                    useValue: client,
                },
            ],
            exports: [
                {
                    provide: REDIS_CLIENT,
                    useValue: client,
                },
            ],
        };
    }
    constructor(@Inject(REDIS_CLIENT) private readonly redisClient: IoRedis) {}
    onModuleDestroy() {
        if (this.redisClient) {
            this.redisClient.disconnect();
        }
    }
}

import { DynamicModule, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import IoRedis, { RedisOptions, Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Module({})
export class RedisModule implements OnModuleDestroy {
    static forRoot(options?: RedisOptions): DynamicModule {
        const client = new IoRedis(options);
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
    constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}
    onModuleDestroy() {
        if (this.redisClient) {
            this.redisClient.disconnect();
        }
    }
}

import { Test, TestingModule } from '@nestjs/testing';
import { Redis, RedisModule, REDIS_CLIENT } from '../src';

describe('@zeronejs/redis', () => {
    let client: Redis;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [RedisModule.forRoot()],
        }).compile();

        client = module.get<Redis>(REDIS_CLIENT);
    });

    it('should be defined', () => {
        expect(client).toBeDefined();
        client.disconnect();
    });
});

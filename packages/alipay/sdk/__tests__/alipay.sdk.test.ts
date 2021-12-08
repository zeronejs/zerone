import { Test, TestingModule } from '@nestjs/testing';
import { AlipayModule, AlipayService } from '../src';

describe('@zeronejs/alipay-sdk', () => {
    let service: AlipayService;
    let services: AlipayService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AlipayModule.forRoot({
                    appId: '202100219966xxxx',
                    privateKey: 'xxxxxxxxx',
                }),
            ],
        }).compile();
        const modules: TestingModule = await Test.createTestingModule({
            imports: [
                AlipayModule.forRoot([
                    {
                        name: 'test1',
                        appId: '202100219966xxxx',
                        privateKey: 'xxxxxxxxx',
                    },
                    {
                        name: 'test2',
                        appId: '202100219966xxxx',
                        privateKey: 'xxxxxxxxx',
                    },
                ]),
            ],
        }).compile();
        service = module.get<AlipayService>(AlipayService);
        services = modules.get<AlipayService>(AlipayService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(service.getInstance()).toBeDefined();
        expect(service.getInstances()).toBeDefined();
        expect(services).toBeDefined();
        expect(services.getInstance('test1')).toBeDefined();
        expect(services.getInstances()).toBeDefined();
    });
});

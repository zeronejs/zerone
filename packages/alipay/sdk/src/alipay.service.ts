import { Injectable, Inject } from '@nestjs/common';
import AlipaySdk from 'alipay-sdk';
import { AlipayModuleInstances } from './alipay.types';
import { ALIPAY_INSTANCES } from './constants';

@Injectable()
export class AlipayService {
    constructor(@Inject(ALIPAY_INSTANCES) private readonly alipayInstance: AlipayModuleInstances) {}

    getInstance(name?: string): AlipaySdk {
        if (!name) {
            name = this.alipayInstance.defaultKey;
        }
        const instance = this.alipayInstance.instances.get(name);
        if (!instance) {
            throw new Error(`alipayInstance ${name} does not exist!`);
        }
        return instance;
    }

    getInstances(): Map<string, AlipaySdk> {
        return this.alipayInstance.instances;
    }
}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
@Module({
    providers: [
        {
            // 角色权限
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class RolesModule {}

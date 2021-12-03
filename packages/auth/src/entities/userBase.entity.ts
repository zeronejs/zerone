import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    // 仅仅为方便查询用户信息设置的一个Entity,不允许开启同步
    synchronize: false,
    name: 'user_entity',
    // title: 'user_spare_entity'
})
export class UserSpareEntity {
    @PrimaryGeneratedColumn()
    id: number;
    /**
     * 用户名
     */
    @Column()
    username: string;
    /**
     * 密码
     */
    @Column()
    password: string;
}

// import { Role } from '@common/role';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BaseEntity,
} from 'typeorm';
export enum Gender {
    unknown,
    mam,
    woman,
}
/**
 * 用户表
 */
@Entity()
export class UserEntity extends BaseEntity{
    /**
     * id
     */
    @PrimaryGeneratedColumn()
    id: number;
    /**
     * 用户名
     */
    @Index({ unique: true })
    @Column({ unique: true })
    username: string;
    /**
     * 密码
     */
    @Column()
    password: string;
    /**
     * 性别
     */
    @Column({
        default: Gender.unknown,
    })
    gender: Gender;
    /**
     * 手机号
     */

    @Column({ nullable: true })
    phone?: string;
    /**
     * 头像
     */
    @Column({ nullable: true })
    avatar?: string;
    /**
     * 昵称
     */
    @Column({ nullable: true })
    nickname?: string;
    /**
     * 签名
     */
    @Column({ nullable: true })
    desc?: string;
    /**
     * 创建时间
     */
    @CreateDateColumn()
    createdAt: Date;
    /**
     * 修改时间
     */
    @UpdateDateColumn()
    updatedAt: Date;

    // /**
    //  * 角色
    //  */
    // @Column('int', {
    //     default: [Role.User],
    //     array: true,
    // })
    // roles: Role[];
}

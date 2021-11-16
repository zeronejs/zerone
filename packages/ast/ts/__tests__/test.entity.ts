// import { Role } from '@common/role';
import path1 from 'path';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

const tes2 = {
	a: 1,
	b: null,
};
const tes3 = [1, {}];
export enum Gender {
	unknown = 's',
	// mam,
	// woman,
}
interface UserInput {
	username: string;
}
type Password = string;

/**
 * 用户表1
 * 234
 * 55
 */
//123
/**
 * 1234
 */
/**
 * 1235566
 */
@Entity()
export class UserEntity  {
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
	password: Password;
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
	createdAt: Date & string;
	/**
	 * 修改时间
	 */
	@UpdateDateColumn()
	updatedAt: Date | string;

	// /**
	//  * 角色
	//  */
	// @Column('int', {
	//     default: [Role.User],
	//     array: true,
	// })
	// roles: Role[];
}

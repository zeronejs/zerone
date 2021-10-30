test('this test will not run', () => {
	expect('A').toBe('A');
});
// import { Role } from '@common/role';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
export enum Gender {
	unknown,
	mam,
	woman,
}
/**
 * 用户表
 */
@Entity()
export class TestEntity {
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
	 * 性别
	 */
	@Column({
		default: Gender.unknown,
	})
	gender: Gender;

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
    /**
	 * dates
	 */
	@Column()
	dates: Date[];
	/**
	 * number
	 */
	@Column({ nullable: true })
	number?: number;
	/**
	 * boolean
	 */
	@Column({ nullable: true })
	boolean?: boolean;
	/**
	 * numbers
	 */
	@Column({ nullable: true })
	numbers?: number[];
	// /**
	//  * undefined
	//  */
	// @Column({ nullable: true })
	// undefined1?: undefined;
	/**
	 * any
	 */
	@Column({ nullable: true })
	any?: any;
	/**
	 * unknown
	 */
	@Column({ nullable: true })
	unknown?: unknown;
	/**
	 * isUnionType
	 */
	@Column({ nullable: true })
	isUnionType?: number | string;
}

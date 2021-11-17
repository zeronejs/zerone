// import { Role } from '@common/role';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import path from 'path';
import fs, { TimeLike } from 'fs';
import { CpuInfo } from 'os';

import * as ts from 'typescript';
export enum Gender {
	unknown,
	mam,
	woman,
}
export const TRUE = true;

export type MyString = string;
export interface MyObject {
	a: string;
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
	@Column({ unique: TRUE })
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
	/**
	 * tsTextRange
	 */
	@Column({ nullable: true })
	tsTextRange?: ts.TextRange;
	/**
	 * platformPath
	 */
	@Column({ nullable: true })
	platformPath?: path.PlatformPath;
	/**
	 * pathLike
	 */
	@Column({ nullable: true })
	pathLike?: fs.PathLike;

	/**
	 * timeLike
	 */
	@Column({ nullable: true })
	timeLike?: TimeLike;
	/**
	 * CpuInfo
	 */
	@Column({ nullable: true })
	cpuInfo?: CpuInfo;
	/**
	 * MyString
	 */
	@Column({ nullable: true })
	myString?: MyString;

	/**
	 * MyObject
	 */
	@Column({ nullable: true })
	myObject?: MyObject;
}

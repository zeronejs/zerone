import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BaseEntity,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { GenTableEntity } from './genTable.entity';
export enum ColumnsType {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    Date = 'Date',
}

/**
 * 代码生成字段表
 */
@Entity()
export class GenColumnsEntity extends BaseEntity {
    /**
     * id
     */

    @PrimaryGeneratedColumn()
    id: number;
    
    /**
     * 字段名称
     */
    @Column()
    entityName: string;
    /**
     * 字段描述
     */
    @Column()
    desc: string;
    /**
     * ts类型
     */
    @Column({
        type: 'enum',
        enum: ColumnsType,
    })
    tsType: ColumnsType;
    /**
     * 插入
     */
    @Column()
    isInsert: string;
    /**
     * 编辑
     */
    @Column({
        default: false,
    })
    isEdit: boolean;
    /**
     * 列表
     */
    @Column({
        default: false,
    })
    isList: boolean;
    /**
     * 查询
     */
    @Column({
        default: false,
    })
    isQuery: boolean;
    /**
     * 必填
     */
    @Column({
        default: false,
    })
    required: boolean;

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
     * 表信息
     */
    @ManyToOne(() => GenTableEntity, table => table.columns)
    @JoinColumn({ name: 'tableId' })
    @ApiProperty({ type: () => GenTableEntity })
    table: GenTableEntity;
    /**
     * 表id
     */
    @Column({ name: 'tableId' })
    tableId: number;
}

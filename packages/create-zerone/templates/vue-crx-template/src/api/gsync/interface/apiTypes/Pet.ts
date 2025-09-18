import { type Category, type Tag } from "../../interface";

export interface Pet {
    /** 宠物ID编号 */
    id: number;
    /** 分组 */
    category: Category;
    /** 名称 */
    name: string;
    /** 照片URL */
    photoUrls: string[];
    /** 标签 */
    tags: Tag[];
    /** 宠物销售状态 */
    status: 'available' | 'pending' | 'sold';
}

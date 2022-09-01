class ZeroneStorage<T extends Record<string, any>> {
    private removeItemKeys?: Array<keyof T>;
    private storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }
    /**
     * 设置持久化存储
     */
    setItem<U extends keyof T>(key: U, value: T[U]) {
        this.storage.setItem(String(key), JSON.stringify({ value }));
    }
    /**
     * 获取存储
     */
    getItem<U extends keyof T>(key: U): T[U] | null {
        const item = this.storage.getItem(String(key));
        if (!item && typeof item !== 'string') return item;
        return JSON.parse(item).value;
    }
    /**
     * 删除一个
     */
    removeItem(key: keyof T) {
        this.storage.removeItem(String(key));
    }
    /**
     * 删除多个
     */
    removeByKeys(keys: Array<keyof T>) {
        keys.forEach(it => this.removeItem(it));
    }
    /**
     * 指定removes都删除哪些项
     */
    initRemovesKeys(keys: Array<keyof T>) {
        this.removeItemKeys = keys;
    }
    /**
     * 删除根据初始化时指定的
     */
    removes() {
        if (!this.removeItemKeys) {
            throw new Error('Please run initRemovesKeys first');
        }
        this.removeItemKeys.forEach(it => this.removeItem(it));
    }
    /**
     * 全部清空
     */
    clear() {
        this.storage.clear();
    }
}
/**
 * 有代码提示的localstorage
 * @example new LocalStorage<{a:string}>()
 */
export class LocalStorage<T extends Record<string, any>> extends ZeroneStorage<T> {
    constructor() {
        super(localStorage);
    }
}
/**
 * 有代码提示的sessionStorage
 */
export class SessionStorage<T extends Record<string, any>> extends ZeroneStorage<T> {
    constructor() {
        super(sessionStorage);
    }
}

export declare class ActionStack<T> {
    private _data;
    /**
     * 是否还有元素
     */
    hasNext(): number;
    /**
     * 弹出最后一个元素
     */
    pop(): T;
    /**
     * 追加元素
     * @param data
     */
    push(data: T): this;
    /**
     * 清空元素
     */
    clear(): T[];
}

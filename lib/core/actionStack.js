export class ActionStack {
    constructor() {
        this._data = [];
    }
    /**
     * 是否还有元素
     */
    hasNext() {
        return this._data.length;
    }
    /**
     * 弹出最后一个元素
     */
    pop() {
        const index = this._data.length - 1;
        if (index > -1) {
            return this._data.splice(index, 1)[0];
        }
    }
    /**
     * 追加元素
     * @param data
     */
    push(data) {
        this._data.push(data);
        return this;
    }
    /**
     * 清空元素
     */
    clear() {
        return this._data.splice(0, this._data.length);
    }
}

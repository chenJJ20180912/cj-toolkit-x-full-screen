export class ZIndexProvider {
    constructor(initialVal = 1) {
        this.initialVal = 1;
        this.initialVal = initialVal;
        this.reset();
    }
    reset() {
        this.srl = this.initialVal;
    }
    next() {
        return this.srl++ + "";
    }
}

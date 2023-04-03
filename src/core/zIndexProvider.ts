export class ZIndexProvider {
    srl: number;

    initialVal = 1;

    constructor(initialVal = 1) {
        this.initialVal = initialVal;
        this.reset();
    }

    reset() {
        this.srl = this.initialVal;
    }

    next(): string {
        return this.srl++ + "";
    }
}

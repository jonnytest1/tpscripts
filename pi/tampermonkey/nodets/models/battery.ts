import { column, primary, table } from 'hibernatets';

@table()
export class BatteryLevel {

    @primary()
    readonly id;

    @column({
        type: 'number'
    })
    level: number;

    constructor(...amounts: Array<string | number>) {
        const sum = amounts.map(amount => +amount)
            .reduce((a, b) => a + b, 0);
        this.level = sum / amounts.length;
    }
}
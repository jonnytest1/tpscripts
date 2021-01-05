export interface GoogleCharts {
    google: {
        visualization: {
            DataTable: new () => DataTable

            PieChart: new (container: HTMLElement) => Chart
            ComboChart: new (container: HTMLElement) => ComboChart
        }
    }
}

interface ChartOptions {
    width?: number,
    height?: number,
    title?: string,
    vAxis?: {
        title?: string,
        minValue?: number
    },
}

interface ComboChartOptions extends ChartOptions {
    pointSize?: number,
    seriesType?: 'scatter'
}

interface Chart {
    draw(data: DataTable, options?: ChartOptions)
}

interface ComboChart extends Chart {
    draw(data: DataTable, options?: ComboChartOptions)
}

interface DataTable {
    addColumn(type: 'string' | 'number' | "date", name: string)
    addColumn(opts: any)

    addRows(rows: Array<Array<any>>)
    addRow(row: Array<any>)
}
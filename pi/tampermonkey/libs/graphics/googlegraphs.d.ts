
declare global {
    const google: GoogleChartGlobal
}
export interface GoogleCharts {
    google: GoogleChartGlobal
}

interface GoogleChartGlobal {
    visualization: {
        DataTable: new () => DataTable

        PieChart: new (container: HTMLElement) => Chart
        ComboChart: new (container: HTMLElement) => ComboChart
    },
    charts: {
        load: (...args) => any
        setOnLoadCallback: (cb: () => any) => void
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
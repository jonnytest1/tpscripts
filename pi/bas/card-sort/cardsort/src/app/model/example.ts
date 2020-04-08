import { Card } from './card';




const exampleJSon1: Array<Card> = [{
    title: 'test1',
    children: [
        {
            title: 'test11',
            children: [

            ]
        }, {
            title: 'test12',
            children: [

            ]
        }, {
            title: 'test13',
            children: [

            ]
        }
    ]
}, {
    title: 'test2',
    children: [
        {
            title: 'test21',
            children: [

            ]
        }, {
            title: 'test22',
            children: [

            ]
        }
    ]
}];


export const exampleJson: Array<Array<Card>> = [
    exampleJSon1,
];



export function generateExampleJSon() {

    const json: Array<Array<Card>> = [];
    for (let i = 0; i < 5; i++) {
        const index = json.push([]) - 1;

        const groups = 1 + Math.floor(Math.random() * 5);
        for (let j = 0; j < groups; j++) {
            const groupIndex = json[index].push({
                title: `test ${i} ${j}`,
                index: `group_${i}${j}`,
                children: []
            }) - 1;

            const children = 1 + Math.floor(Math.random() * 4);
            for (let c = 0; c < children; c++) {
                json[index][groupIndex].children.push({
                    title: `test ${i} ${j} ${c}`,
                    index: `node_${i}${j}${c}`,
                    children: []
                });
            }
        }
    }

    return json;

}

import { Node } from 'rete';
import { Data, NodeData, NodesData } from 'rete/types/core/data';

const IMPLEMENTATIONS: Record<string, (node: Node) => string> = {};

function implements(...args: string[]) {
    return function (target: (node: Node) => string) {
        for (let arg in args) {
            IMPLEMENTATIONS[arg] = target;
        }
        return target;
    };
}

function defaultToString(node: Node) {}

export function prepareData(data: NodesData) {
    const refereces = Object.keys(data.nodes).map((_, idx) => {
        const node = data[idx];
        
        `$(data) = a`

        let inline = false;
        if (!hasExternalInputs(node)) {
            inline = true
        }
        return {
            reference: getReferenceName(node),
            definition: toString(node),
            inline:
        };
    });
}

export function toString(node: Node) {
    if (IMPLEMENTATIONS[node.name]) {
        return IMPLEMENTATIONS[node.name](node);
    } else {
        return defaultToString(node);
    }
}

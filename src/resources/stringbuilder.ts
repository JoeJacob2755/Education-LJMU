import { Node } from 'rete';

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

export function toString(node: Node, references: Record<number, string>) {
    if (references[node.id]) {
        return references[node.id];
    }

    if (IMPLEMENTATIONS[node.name]) {
        return IMPLEMENTATIONS[node.name](node);
    } else {
        return defaultToString(node);
    }
}

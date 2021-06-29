import { deepStrictEqual } from 'assert';
import { Node } from 'rete';
import { Data, NodeData, NodesData } from 'rete/types/core/data';
import { FEATURE_RETE_INPUT_NAME } from './constants';

// type Reference = {
//     reference: () => string;
//     _reference: string;
//     definition: (a: Reference[]) => string;

//     node: NodeData;
//     dependencies: number[];
//     inline: boolean;
// };

class Reference {
    _reference: string;
    definition: (a: Reference[]) => string;

    node: NodeData;
    dependencies: number[];
    inline: boolean;
    constructor({ reference, definition, node, dependencies, inline }) {
        this._reference = reference;
        this.definition = definition;
        this.node = node;
        this.dependencies = dependencies;
        this.inline = inline;
    }

    reference(refs: Reference[]) {
        if (this.inline) return this.definition(refs);
        return this._reference;
    }
}

const IMPLEMENTATIONS: Record<string, (node: NodeData) => (refs: Reference[]) => string> = {};

function builds(...args: string[]) {
    return function (target: (node: NodeData) => (refs: Reference[]) => string) {
        args.forEach((arg) => {
            IMPLEMENTATIONS[arg] = target;
        });
        return target;
    };
}

function defaultTemplateBuilder(node: NodeData) {
    return (refs: Reference[]) => {
        const { name, inputs } = node;

        const property_input_keys = Object.keys(inputs).filter(
            (s) => s !== FEATURE_RETE_INPUT_NAME && inputs[s].connections.length,
        );

        const property_references: [string, Reference][] = property_input_keys.map((key) => {
            const prop_node = inputs[key];
            const prop_input_node = prop_node.connections[0];
            return [key, refs.find((n) => n.node.id == prop_input_node.node)];
        });

        const python_declarations = property_references.map(([key, ref]) => {
            return `${key}=${ref.reference(refs)}`;
        });

        if (node.inputs.f_inpt.connections.length == 0) {
            return `dt.${name}(${python_declarations.join(',')})`;
        } else {
            const input_ref = refs.find((r) => r.node.id == node.inputs.f_inpt.connections[0].node);
            return `${input_ref?.reference(refs)} >> dt.${name}(${python_declarations.join(',')})`;
        }
    };
}

function getDependencies(nodes: NodesData, node: NodeData): number[] {
    const { inputs } = node;
    const property_input_keys = Object.keys(inputs).filter((s) => inputs[s].connections.length);

    return property_input_keys
        .map((s) => inputs[s].connections[0].node)
        .concat(...property_input_keys.map((s) => getDependencies(nodes, nodes['' + inputs[s].connections[0].node])));
}

function templateBuilder(node: NodeData) {
    if (IMPLEMENTATIONS[node.name]) {
        return IMPLEMENTATIONS[node.name](node);
    } else {
        return defaultTemplateBuilder(node);
    }
}

function getReferenceName(node: NodeData) {
    return node.name + '_' + node.id;
}

function shouldInline(node: NodeData) {
    if (node.name == 'Property' && node.outputs.p_output?.connections.length <= 1) return true;
    return false;
}

function getInputRef(name: string, node: NodeData, refs: Reference[]): Reference | undefined {
    let inputs = node.inputs;
    let input = inputs[name];
    if (!input) return undefined;

    if (input.connections.length == 0) {
        return undefined;
    }

    return refs.find((r) => r.node.id === input.connections[0].node);
}

export function prepareData(data: NodesData) {
    return Object.keys(data)
        .filter((key) => data[key])
        .map((key) => {
            const node = data[key];

            // let inline = false;

            // if (!hasExternalInputs(node)) {
            //     inline = true
            // }
            return new Reference({
                reference: getReferenceName(node),
                definition: templateBuilder(node),
                dependencies: getDependencies(data, node),
                node: node,
                inline: shouldInline(node),
            });
        });
}

export function createPythonDefinitions(_: NodesData, references: Reference[]) {
    const sorted_refs = references
        .filter((r) => !r.inline)
        .sort((a, b) => {
            if (a.dependencies.includes(b.node.id)) return 1;
            if (b.dependencies.includes(a.node.id)) return -1;
            if (a._reference < b._reference) return -1;
            if (b._reference < a._reference) return 1;
            return 0;
        });

    return sorted_refs.map((s) => `${s.reference(references)}=${s.definition(references)}`).join('\n\n');
}

export function createPythonPipeline(_: NodesData, references: Reference[]) {
    const input_features = references.filter((r) => r.node.inputs?.f_inpt?.connections?.length == 0);
}

const buildProperty = builds('Property')(
    (node) => (refs) =>
        refs.find((r) => r.node.id == node.id)?.inline
            ? node.data.p_output + '' || 'None'
            : `dt.Property(${node.data.p_output || 'None'})`,
);

const buildOperator = builds('Add')((node) => (refs) => {
    const input_ref = getInputRef('f_inpt', node, refs)?.reference(refs);
    const value_ref = getInputRef('value', node, refs)?.reference(refs);
    return `${input_ref} + ${value_ref}`;
});

import { createNode, traverse } from './utils';

export default function (Menu) {
    return class NodeMenu extends Menu {
        constructor(editor, props, nodeItems) {
            super(editor, props);

            this.addItem('Create properties', (args) => {
                const {
                    name,
                    position: [x, y],
                    inputs,
                    ...params
                } = args.node;
                const property_node = editor?.components?.get('Property');
                (editor.components.get(name)?.feature?.properties || []).forEach((prop, idx) => {
                    const input = inputs.get(prop.name);
                    console.log(input);
                    property_node.createNode({}).then((p_node) => {
                        p_node.meta = {};
                        p_node.position[0] = args.node.position[0] - 300;
                        p_node.position[1] = Math.round(args.node.position[1]) + 145 + 45 * idx;
                        const control = p_node.controls.get('p_output');
                        control.setValue.bind(control)(prop.value);

                        editor?.addNode(p_node);

                        // Connect
                        const output = p_node.outputs.get('p_output');
                        if (input && output) {
                            editor?.connect(output, input);
                        }
                    });
                });
            });
            this.addItem('Delete', ({ node }) => editor.removeNode(node));
            this.addItem('Clone', async (args) => {
                const {
                    name,
                    position: [x, y],
                    ...params
                } = args.node;
                const component = editor.components.get(name);
                const node = await createNode(component, { ...params, x: x + 10, y: y + 10 });

                editor.addNode(node);
            });

            traverse(nodeItems, (name, func, path) => this.addItem(name, func, path));
        }
    };
}

import React from 'react';
import Rete, { Node } from 'rete';
// @ts-ignore
import ReactRenderPlugin, { Node as NodeComponent } from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
// @ts-ignore
import ContextMenuPlugin, { ReactMenu } from './ContextMenu/index.js';
// @ts-ignore
import AreaPlugin from 'rete-area-plugin';
import { Data, NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import PythonApi from '../../resources/PythonApi';
import { ViewModuleSharp } from '@material-ui/icons';

import { stringSocket, featureSocket, imageSocket } from './Sockets';
import { Feature } from '../../resources/dtserver/grpc/Feature.js';
import * as fs from 'fs';
import { writePython } from '../../utils';
import { dirname, join, basename } from 'path';
import { SOURCE_DIR_NAME } from '../../resources/constants';

const FeatureControlComponent = ({
    value,
    onChange,
    defaultValue,
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => (
    <input
        className="feature-control-input"
        type="text"
        defaultValue={defaultValue}
        value={value}
        ref={(ref) => {
            ref && ref.addEventListener('pointerdown', (e) => e.stopPropagation());
        }}
        onChange={onChange}
    />
);

class FeatureControl extends Rete.Control {
    emitter: any;
    component = FeatureControlComponent;
    props: {
        readonly: boolean;
        value: string | undefined;
        defaultValue?: string;
        onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
    };

    setValue(val: string) {
        this.props.value = val;
        this.putData(this.key, val);
        // @ts-ignore
        this.update();
    }

    constructor(emitter: any, key: string, _: Node, readonly = false) {
        super(key);
        this.emitter = emitter;
        this.key = key;

        this.props = {
            readonly,
            value: undefined,
            onChange: (v) => {
                this.setValue(v.target.value);
                this.emitter.trigger('process');
            },
        };
    }
}

export class FeatureComponent extends Rete.Component {
    feature: Feature;
    package: string;
    constructor(feature_name: string, feature: Feature) {
        super(feature_name);
        this.package = feature.package || 'misc';
        this.feature = feature;
    }

    async builder(node: Node) {
        var inpt = new Rete.Input('f_inpt', 'input', imageSocket);

        var outp = new Rete.Output('f_outp', 'result', imageSocket);
        var feat = new Rete.Output('feature', 'feature', featureSocket);
        // var ctrl = new FeatureControl(this.editor, 'f_inpt', node, false);

        // inpt.addControl(new FeatureControl(this.editor, 'f_inpt', node));
        node.addInput(inpt).addOutput(outp).addOutput(feat);

        const property_node = this.editor?.components?.get('Property');
        console.log(this.feature.properties);
        this.feature?.properties?.forEach((prop, idx) => {
            if (!prop) return;
            let { name, value } = prop;
            console.log(name, value, prop);
            const input = new Rete.Input(name, name, stringSocket);
            node.addInput(input);
            if (property_node) {
                property_node.createNode({}).then((p_node: Node) => {
                    let iters = 0;

                    p_node.controls.get('p_output').props.defaultValue = value;
                    // This is a bad hack. It's done since the position of the node is not known at this point.
                    const c = setInterval(() => {
                        iters++;
                        if ((node.position[0] !== 0 && node.position[1] !== 0) || iters > 5) {
                            p_node.meta = {};
                            p_node.position[0] = node.position[0] - 300;
                            p_node.position[1] = node.position[1] + 145 + 44 * idx;
                            this.editor?.addNode(p_node);

                            // Connect
                            const output = p_node.outputs.get('p_output');
                            if (input && output) {
                                this.editor?.connect(output, input);
                            }

                            // console.log(p_node.data, this.feature.properties[name].default);
                            clearInterval(c);
                        }
                    }, 100);
                });
            }
        });
    }

    worker(node: NodeData, _1: WorkerInputs, outputs: WorkerOutputs) {
        outputs['f_out'] = node.data.f_inpt;
    }
}

export class PropertyComponent extends Rete.Component {
    // property: PropertyType;

    constructor() {
        super('Property');
        // this.property = property;
    }

    async builder(node: Node) {
        const output = new Rete.Output('p_output', '', stringSocket);
        const control = new FeatureControl(this.editor, 'p_output', node, false);
        node.addOutput(output).addControl(control);
    }

    worker(node: NodeData, _1: WorkerInputs, outputs: WorkerOutputs) {
        outputs['p_output'] = node.data.p_output;
    }
}

export async function createEditor(container: HTMLElement, dataPath: string) {
    const editorData = JSON.parse(fs.readFileSync(dataPath)) as Data;
    const response = await PythonApi.getFeaturesPromise({});
    console.log(response.features);

    if (!response) {
        console.error('Unable to load features from server');
        return;
    }

    var editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin, {
        Menu: ReactMenu,
        delay: 0,
        allocate(component: FeatureComponent) {
            return [component.package];
        },
    });

    var engine = new Rete.Engine('demo@0.1.0');

    response.features.forEach((feature) => {
        const c = new FeatureComponent(feature.name, feature);
        editor.register(c);
        engine.register(c);
    });

    const p_c = new PropertyComponent();
    editor.register(p_c);
    engine.register(p_c);
    // @ts-ignore
    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        console.log('process');
        await engine.abort();
        const data = editor.toJSON();
        await engine.process(data);
        fs.writeFileSync(dataPath, JSON.stringify(data));
        writePython(data, join(dirname(dataPath), '..', SOURCE_DIR_NAME, basename(dataPath).split('.')[0] + '.py'));
    });

    editor.view.resize();
    if (editorData) {
        try {
            editor.fromJSON(editorData);
        } catch {
            console.log('Loaded empty json');
        }
    }

    editor.trigger('process');
    AreaPlugin.zoomAt(editor, editor.nodes);
}

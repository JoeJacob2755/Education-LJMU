import React from 'react';
import Rete, { Node } from 'rete';
// @ts-ignore
import ReactRenderPlugin, { Node as NodeComponent } from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
// @ts-ignore
import HistoryPlugin from 'rete-history-plugin';
// @ts-ignore
import ContextMenuPlugin, { ReactMenu } from './ContextMenu/index.js';
// @ts-ignore
import AreaPlugin from 'rete-area-plugin';
import { Data, NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import PythonApi from '../../resources/PythonApi';
import { ReportRounded, ViewModuleSharp } from '@material-ui/icons';

import { stringSocket, featureSocket, imageSocket } from './Sockets';
import { Feature } from '../../resources/dtserver/grpc/Feature.js';
import * as fs from 'fs';
import { writePython } from '../../utils';
import { dirname, join, basename } from 'path';
import { SOURCE_DIR_NAME } from '../../resources/constants';
import Rect from './Rect';

const FeatureControlComponent = ({
    value,
    onChange,
}: {
    value: () => string | undefined;
    onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}) => (
    <input
        className="feature-control-input"
        type="text"
        // defaultValue={defaultValue}
        value={typeof value == 'string' ? value : value()}
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
        value: string | (() => string | undefined);
        defaultValue?: string;
        onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
    };

    setValue(val: string) {
        this.putData(this.key, val);
        this.props.value = val;
        // @ts-ignore
        try {
            this.update();
        } catch (error) {
            console.log('no update');
        }
    }

    constructor(emitter: any, key: string, _: Node, readonly = false) {
        super(key);
        this.emitter = emitter;
        this.key = key;

        this.props = {
            readonly,
            value: () => this.getData(this.key),
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
        this.feature?.properties?.forEach((prop) => {
            if (!prop) return;
            let { name, value } = prop;
            const input = new Rete.Input(name, name, stringSocket);
            node.addInput(input);
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

    if (!response) {
        console.error('Unable to load features from server');
        return;
    }
    console.log(document.head.children);
    var editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(HistoryPlugin, { keyboard: false });
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin, {
        Menu: ReactMenu,
        delay: 0,
        allocate(component: FeatureComponent) {
            return [component.package];
        },
    });

    console.log(document.head.children);

    editor.use(AreaPlugin, { snap: 5, scaleExtent: { min: 0.1, max: 4 } });
    // I hate rete plugins
    AreaPlugin._snap.size = 5;

    var engine = new Rete.Engine('demo@0.1.0');

    response.features.forEach((feature) => {
        const c = new FeatureComponent(feature.name, feature);
        editor.register(c);
        engine.register(c);
    });

    const p_c = new PropertyComponent();
    editor.register(p_c);
    engine.register(p_c);

    const rectangle = new Rect(editor, {});

    let boundTranslate = false;
    let x0: number = 0;
    let y0: number = 0;
    container.addEventListener('mousedown', (e) => {
        console.log(e.target);
        if (e.target !== editor.view.container) return;
        if (!e.ctrlKey) {
            editor.selected.clear();
            editor.nodes.map((n) => n.update());
            return;
        }
        x0 = e.clientX;
        y0 = e.clientY - 25;
        boundTranslate = true;
    });

    container.addEventListener('mousemove', (e) => {
        if (boundTranslate) {
            const dx = Math.abs(x0 - e.clientX);
            const dy = Math.abs(y0 - e.clientY + 25);
            const x = Math.min(x0, e.clientX);
            const y = Math.min(y0, e.clientY - 25);
            rectangle.show(x, y, dx, dy);
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (boundTranslate) {
            const { k, x: xt, y: yt } = editor.view.area.transform;
            console.log(editor.view);
            console.log(k, xt, yt);
            const dx = Math.abs(x0 - e.clientX) / k;
            const dy = Math.abs(y0 - e.clientY + 25) / k;
            const x = Math.min(x0, e.clientX) / k - xt / k - editor.view.container.offsetLeft / k;
            const y = Math.min(y0, e.clientY - 25) / k - yt / k;

            editor.nodes.forEach((node) => {
                console.log(y, y + dy, node.position[1]);
                if (
                    node.position[0] >= x &&
                    node.position[0] <= x + dx &&
                    node.position[1] >= y &&
                    node.position[1] <= y + dy
                ) {
                    editor.selectNode(node, true);
                }
            });
        }
        rectangle.hide();
        boundTranslate = false;
    });

    editor.on('keydown', (e) => {
        if (e.key === 'Delete') {
            editor.selected.each((n) => editor.removeNode(n));
        } else if (e.ctrlKey && !e.shiftKey && e.code === 'KeyA') {
            editor.nodes.forEach((n) => editor.selectNode(n, true));
            e.stopPropagation();
            e.preventDefault();
        } else if (e.ctrlKey && e.code === 'KeyZ') {
            console.log(e.shiftKey);
            editor.trigger(e.shiftKey ? 'redo' : 'undo');
        }
    });
    editor.on('translate', (e) => {
        if (boundTranslate) {
            return false;
        }
    });

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

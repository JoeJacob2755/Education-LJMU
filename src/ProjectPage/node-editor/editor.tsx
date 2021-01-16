import React from 'react';
import Rete, { Node } from 'rete';
// @ts-ignore
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
// @ts-ignore
import ContextMenuPlugin from 'rete-context-menu-plugin';
// @ts-ignore
import AreaPlugin from 'rete-area-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

var stringSocket = new Rete.Socket('String');

const FeatureControlComponent = ({
    value,
    onChange,
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => (
    <input
        type="text"
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

class FeatureComponent extends Rete.Component {
    constructor() {
        super('dt.feature');
    }

    async builder(node: Node) {
        var inpt = new Rete.Input('f_inpt', 'input', stringSocket);
        var outp = new Rete.Output('f_outp', 'output', stringSocket);
        var ctrl = new FeatureControl(this.editor, 'f_inpt', node, false);

        inpt.addControl(new FeatureControl(this.editor, 'f_inpt', node));

        node.addInput(inpt).addControl(ctrl).addOutput(outp);
    }

    worker(node: NodeData, _1: WorkerInputs, outputs: WorkerOutputs) {
        outputs['f_out'] = node.data.f_inpt;
    }
}

export async function createEditor(container: HTMLElement) {
    var components = [new FeatureComponent()];

    var editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin);

    var engine = new Rete.Engine('demo@0.1.0');

    components.map((c) => {
        editor.register(c);
        engine.register(c);
    });

    // @ts-ignore
    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        console.log('process');
        await engine.abort();
        await engine.process(editor.toJSON());
    });

    editor.view.resize();
    editor.trigger('process');
    AreaPlugin.zoomAt(editor, editor.nodes);
}
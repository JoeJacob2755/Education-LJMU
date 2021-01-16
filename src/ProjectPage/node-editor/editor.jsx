import React from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';

var stringSocket = new Rete.Socket('String');

class FeatureControl extends Rete.Control {
    static component = ({ value, onChange }) => (
        <input
            type="text"
            value={value}
            ref={(ref) => {
                ref && ref.addEventListener('pointerdown', (e) => e.stopPropagation());
            }}
            onChange={(e) => onChange(e.target.value)}
        />
    );

    constructor(emitter, key, node, readonly = false) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.component = FeatureControl.component;

        this.props = {
            readonly,
            value: null,
            onChange: (v) => {
                this.setValue(v);
                this.emitter.trigger('process');
            },
        };
    }

    setValue(val) {
        this.props.value = val;
        this.putData(this.key, val);
        this.update();
    }
}

class FeatureComponent extends Rete.Component {
    constructor() {
        super('dt.feature');
    }

    builder(node) {
        var inpt = new Rete.Input('f_inpt', 'input', stringSocket);
        var outp = new Rete.Output('f_outp', 'output', stringSocket);
        var ctrl = new FeatureControl(this.editor, 'f_inpt', false);

        inpt.addControl(new FeatureControl(this.editor, 'f_inpt', node));

        return node.addInput(inpt).addControl(ctrl).addOutput(outp);
    }

    worker(node, inputs, outputs) {
        outputs['f_out'] = node.data.f_inpt;
    }
}

export async function createEditor(container) {
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

    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        console.log('process');
        await engine.abort();
        await engine.process(editor.toJSON());
    });

    editor.view.resize();
    editor.trigger('process');
    AreaPlugin.zoomAt(editor, editor.nodes);
}

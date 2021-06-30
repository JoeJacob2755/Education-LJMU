import React from 'react';
import { NodeEditor } from 'rete';
import ReactDOM from 'react-dom';

type RectProps = {};

export default class Rect {
    props: RectProps;
    editor: NodeEditor;
    elem: HTMLDivElement;
    x: number;
    y: number;
    height: number;
    width: number;
    visible: boolean;

    constructor(editor: NodeEditor, props: RectProps) {
        this.props = props;
        this.editor = editor;
        this.elem = document.createElement('div');
        this.x = 0;
        this.y = 0;
        this.height = 0;
        this.width = 0;
        this.visible = false;
        editor.view.container.appendChild(this.elem);
    }

    show(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.visible = true;
        this.render();
    }

    hide() {
        this.visible = false;
        this.render();
    }

    render() {
        const { x, y, height, width, visible } = this;
        ReactDOM.render(
            <div
                style={{
                    display: visible ? 'unset' : 'none',
                    position: 'absolute',
                    left: x,
                    top: y,
                    height: height,
                    width: width,
                    border: 'solid 1px white',
                }}
            ></div>,
            this.elem,
        );
    }
}

// export default Rect;

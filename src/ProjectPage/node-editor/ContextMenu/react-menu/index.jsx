//eslint

import ReactDOM from 'react-dom';
import ReactMenu, { ContextMenuProps } from './Menu';
import { ContextItemType } from './Item';
import Menu from '../menu';
import { injectItem } from '../utils';
import React, { JSXElementConstructor } from 'react';
import { NodeEditor } from 'rete';

export default class extends Menu {
    props: ContextMenuProps;
    items: ContextItemType[];
    position: [number, number];
    visible: boolean;
    el: HTMLElement;
    args: null;
    constructor(editor: NodeEditor, props: ContextMenuProps) {
        super();
        this.props = props;
        this.items = [];
        this.position = [0, 0];
        this.visible = false;
        this.el = document.createElement('div');
        editor.view.container.appendChild(this.el);

        this.render();
    }

    addItem(title: string, onClick: MouseEvent, path = []) {
        injectItem(this.items, title, onClick, path);
        this.render();
    }

    show(x: number, y: number, args: null) {
        this.position = [x, y];
        this.args = args;
        this.visible = true;
        this.render();
    }

    hide() {
        this.visible = false;
        this.render();
    }

    render() {
        ReactDOM.render(
            <ReactMenu
                {...this.props}
                args={this.args}
                items={this.items}
                position={this.position}
                visible={this.visible}
                onClose={() => this.hide()}
            />,
            this.el,
        );
    }
}

export { Menu };

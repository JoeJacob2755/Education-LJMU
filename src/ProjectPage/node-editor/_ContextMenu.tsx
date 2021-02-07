import { NodeEditor } from 'rete';
import React, { ReactChildren, createContext, ReactNode, JSXElementConstructor } from 'react';

function install(editor: NodeEditor, { category = () => [] }): void {
    editor.bind('hidecontextmenu');
    editor.bind('showcontextmenu');

    editor.on('contextmenu', ({ e, node }) => {
        e.preventDefault();
        e.stopPropagation();

        // tslint:disable-next-line
        if (!editor.trigger('showcontextmenu', { e, node })) return;

        const [x, y] = [e.clientX, e.clientY];
    });
}

export const Context = createContext({ onClose() {}, args: null });

// Context menu item
export type ContextItemType = {
    onClick: ((event: React.MouseEvent) => void) | undefined;
    title: string;
    subitems?: ContextItemType[] | undefined;
};

export type ContextItemProps = {
    item: ContextItemType;
    ItemComponent?: JSXElementConstructor<any>;
};

class Item extends React.Component<ContextItemProps, { visibleSubitems: boolean }> {
    constructor(props: ContextItemProps) {
        super(props);
        this.state = {
            visibleSubitems: false,
        };
    }

    onClick = (e: React.MouseEvent) => {
        const {
            item: { onClick },
        } = this.props;
        const { args, onClose } = this.context;

        e.stopPropagation();

        if (onClick) onClick(args);
        onClose();
    };

    render() {
        let {
            item: { title, subitems },
            ItemComponent,
        } = this.props;

        if (!ItemComponent) {
            ItemComponent = (props) => <div {...props} />;
        }
        const { visibleSubitems } = this.state;

        return (
            <ItemComponent
                className={'item' + (subitems ? ' hasSubitems' : '')}
                onClick={this.onClick}
                onMouseOver={() => this.setState({ visibleSubitems: true })}
                onMouseLeave={() => this.setState({ visibleSubitems: false })}
                item={this.props.item}
            >
                {title}
                {subitems && visibleSubitems && (
                    <div className="subitems">
                        {subitems.map((subitem) => (
                            <Item key={subitem.title} item={subitem} ItemComponent={ItemComponent} />
                        ))}
                    </div>
                )}
            </ItemComponent>
        );
    }
}
Item.contextType = Context;

// Context Menu

type ContextMenuProps = {
    items: ContextItemType[];
    position: [number, number];
    visible: boolean;
    args: null;
    onClose: () => void;
    Components: {
        Menu?: JSXElementConstructor<any>;
        Item?: JSXElementConstructor<any>;
    };
};

function defaultWrapper(props: any) {
    const { className, style } = props;
    return (
        <div className={className} style={style}>
            {' '}
            {props.children}{' '}
        </div>
    );
}

const Menu = (props: ContextMenuProps) => {
    const {
        items,
        position: [x, y],
        visible,
        args,
        onClose,
        Components,
    } = props;
    if (!visible) return null;

    if (!Components.Menu) {
        Components.Menu = defaultWrapper;
    }
    if (!Components.Item) {
        Components.Item = defaultWrapper;
    }

    return (
        <Context.Provider value={{ args, onClose }}>
            <Components.Menu items={items} className="context-menu" style={{ left: x + 'px', top: y + 'px' }}>
                {items.map((item) => (
                    <Item key={item.title} ItemComponent={Components.Item} item={item} />
                ))}
            </Components.Menu>
        </Context.Provider>
    );
};

class ContextMenu {}

export default {
    name: 'context-menu',
    install,
};

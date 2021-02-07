// import "./style.sass";
import Item, { ContextItemType } from './Item';
import Context from './context';
import React, { JSXElementConstructor } from 'react';

export type ContextMenuProps = {
    items: ContextItemType[],
    position: [number, number],
    visible: boolean,
    args: null,
    onClose: () => void,
    Components: {
        Menu?: JSXElementConstructor<any>,
        Item?: JSXElementConstructor<any>,
    },
};

function defaultWrapper(props: any) {
    const { className, style } = props;
    return <div {...props}></div>;
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

export default Menu;

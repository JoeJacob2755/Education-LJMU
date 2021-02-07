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
        Search?: JSXElementConstructor<
            React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        >,
    },
};

function defaultWrapper(props: any) {
    const { className, style } = props;
    return <div {...props}></div>;
}

function defaultInput(props: any) {
    const { className, style } = props;
    return <input {...props} />;
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

    const [search, setSearch] = React.useState('');

    if (!Components.Menu) {
        Components.Menu = defaultWrapper;
    }
    if (!Components.Item) {
        Components.Item = defaultWrapper;
    }
    if (!Components.Search) {
        Components.Search = defaultInput;
    }

    function renderItems() {
        if (search.length == 0) {
            return items.map((item) => <Item key={item.title} ItemComponent={Components.Item} item={item} />);
        } else {
            const allItems = [];
            const collectItems = (item: ContextItemType) => {
                if (item.title.toLowerCase().includes(search.toLowerCase())) {
                    allItems.push(item);
                }
                if (item.subitems) {
                    item.subitems.forEach(collectItems);
                }
            };

            items.forEach(collectItems);

            return allItems.map((item) => <Item key={item.title} ItemComponent={Components.Item} item={item} />);
        }
    }

    return (
        <Context.Provider value={{ args, onClose }}>
            <Components.Menu items={items} className="context-menu" style={{ left: x + 'px', top: y + 'px' }}>
                <Components.Search
                    className="context-search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.currentTarget.value);
                    }}
                />
                {renderItems()}
            </Components.Menu>
        </Context.Provider>
    );
};

export default Menu;

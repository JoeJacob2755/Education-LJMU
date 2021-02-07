import Context from './context';
// import './style.sass';
import React, { JSXElementConstructor } from 'react';

export type ContextItemType = {
    onClick: ((event: React.MouseEvent) => void) | undefined,
    title: string,
    subitems?: ContextItemType[] | undefined,
};

export type ContextItemProps = {
    item: ContextItemType,
    ItemComponent?: JSXElementConstructor<any>,
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
                onMouseOver={() => {
                    this.setState({ visibleSubitems: true });
                }}
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

export default Item;

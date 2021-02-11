import Context from './context';
import React, { JSXElementConstructor, ChangeEvent } from 'react';


export type ContextSearchProps = {
    value: string
    onChange: (e:ChangeEvent) => void
    SearchComponent: JSXElementConstructor<any>
};

class Item extends React.Component<ContextSearchProps> {
    constructor(props: ContextSearchProps) {
        super(props);
        this.state = {
            visibleSubitems: false,
        };
    }

    render() {
        let {
            value,
            onChange,
            SearchComponent,
        } = this.props;

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
                    <div className="subitems bg-">
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

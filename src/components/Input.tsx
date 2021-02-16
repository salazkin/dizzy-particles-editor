import React, { Component, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import PropValue from './PropValue';

export default class Input extends Component<any, any> {
    private target;
    private textInput;
    constructor(props) {
        super(props);
        this.state = { value: "", visible: false, rect: { x: 0, y: 0, width: 1, height: 1 } };
        this.textInput = React.createRef();
    }

    public show(target ) {
        this.target = target;
        let domNode: Element = ReactDOM.findDOMNode(target) as Element;
        let rect = domNode.getBoundingClientRect();
        this.setState({ value: target.state.value, visible: true, rect: rect });
    }

    public componentDidUpdate(): void {
        this.textInput.current.focus();
    }

    private onChange(event) {
        this.target.setText(event.target.value);
        this.setState({ value: event.target.value });
    }

    private onFocusOut(event) {
        this.setState({ visible: false });
        this.target.updateConfigValue(event.target.value);
    }

    render() {
        let inputStyle: CSSProperties = {
            visibility: this.state.visible ? "visible" : "hidden",
            position: "absolute",
            left: this.state.rect.x,
            top: this.state.rect.y,
            width: this.state.rect.width + 3,
            border: 0,
            padding: 0,
            margin: 0,
            fontSize: 16,
            font: "sans-serif"
        }
        return (<input
            ref={this.textInput}
            value={this.state.value}
            style={inputStyle}
            onChange={this.onChange.bind(this)}
            onBlur={this.onFocusOut.bind(this)}
        />);
    }
}

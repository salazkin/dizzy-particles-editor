import React, { Component } from 'react';
import Stage from '../canvas/Stage';

class Canvas extends Component<any, any> {

    private canvas: HTMLCanvasElement;

    public componentDidMount(): void {
        new Stage(this.canvas);
    }

    canvasRef = ref => {
        this.canvas = ref;
    };

    render() {
        return (
            <canvas ref={this.canvasRef} onContextMenu={(e) => e.preventDefault()} className="Canvas" width={window.innerWidth} height={window.innerHeight}></canvas>
        );
    }
}


export default Canvas;

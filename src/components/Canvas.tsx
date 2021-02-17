import React, { useEffect, useRef } from 'react';
import Stage from '../canvas/Stage';

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => { new Stage(canvasRef.current!); }, []);
    return (
        <canvas ref={canvasRef} onContextMenu={(e) => e.preventDefault()} className="canvas" width={window.innerWidth} height={window.innerHeight}></canvas>
    );
};




export default Canvas;

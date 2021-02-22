import { isEqual } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Stage from '../canvas/Stage';

let stage: Stage;
let currentConfig = null;

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const config = useSelector((state: any) => state.config.output);

    useEffect(() => {
        stage = new Stage(canvasRef.current!);
    }, []);


    useEffect(() => {
        if (stage && !isEqual(config, currentConfig)) {
            stage.createParticles(config);
            currentConfig = config;
        }
    });


    return (
        <canvas ref={canvasRef} onContextMenu={(e) => e.preventDefault()} className="canvas" width={window.innerWidth} height={window.innerHeight}></canvas>
    );
};




export default Canvas;

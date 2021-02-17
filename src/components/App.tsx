import React from 'react';
import Canvas from './Canvas';
import Controls from './Controls';

const App: React.FC = () => {
    return (
        <div className="app">
            <Canvas />
            <Controls />
        </div>
    );
};

export default App;

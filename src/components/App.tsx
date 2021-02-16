import React, { Component } from 'react';
import '../css/Styles.css';
import Controls from './Controls';
import Canvas from './Canvas';

class App extends Component<any, any> {


    render() {
        return (
            <div className="App">

                <Canvas />
                <Controls />
            </div>
        );
    }
}


export default App;

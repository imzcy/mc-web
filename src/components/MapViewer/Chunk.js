import React, { Component } from 'react';
import Base64Binary from './Base64Binary';
import fetchClient from '../../utils/fetchClient';

const pad2 = t => `0${t.toString(16)}`.substr(-2);
const typeToColor = t => {
    //const c = pad2(256 - (t % 256));
    // console.log(t, `#${c}${c}${c}`);
    // return `#${c}${c}${c}`;
    const c = getColor(t);
    return `#${pad2(c[0])}${pad2(c[1])}${pad2(c[2])}`;
}

function getColor(t) {
    const item = t % 256;
    const cat = t >> 8;
    switch (item) {
    case 0x2:
        return [127, 178, 56];
    case 0x3:
        return [151, 109, 77];
    case 0xd:
        return [112, 112, 112];
    case 0xc: case 0x18:
        return [247, 233, 163];
    case 0x2e: case 0x11: case 0x10: case 0x98:
        return [255, 0, 0];
    case 0xae: case 0xd4: case 0x4f:
        return [160, 160, 255];
    case 0x2a:
        return [167, 167, 167];
    case 0x12: case 0xa1:
        return [0, 124, 0];
    case 0x1: case 0x4: case 0x2b: case 0x2c: case 0x43: case 0x61: case 0x62: case 0x6d: case 0x8b: case 0x9e: case 0xda:
        return [112, 112, 112];
    case 0x8: case 0x9:
        return [64, 64, 255];
    default:
        // console.log(item, cat);
        return [0, 0, 0];
    }
}

const colors = {
    2: [127, 178, 56],

}

export default class Chunk extends Component {

    state = {
        data: null
    }

    componentDidUpdate(prevProps) {
        const context = this.canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        // console.log('data', this.state.data);

        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

        const ratio = devicePixelRatio / backingStoreRatio;

        const size = parseInt(this.props.size, 10);

        const blockSize = size * ratio / 16;
        const canvasSize = size * ratio;
        this.canvas.setAttribute('width', canvasSize);
        this.canvas.setAttribute('height', canvasSize);
        context.save();
        const data = this.state.data;
        try {
            if (data === null) {
                context.fillStyle = "#fffaf0";
                context.fillRect(0, 0, canvasSize, canvasSize);
                return;
            }
            if (data instanceof Error) {
                context.fillStyle = "#ff8888";
                context.fillRect(0, 0, canvasSize, canvasSize);
                return;
            }
            const buf = new Uint16Array(data);
            // console.log(buf);
            for (let z = 0; z < 16; z++) {
                for (let x = 0; x < 16; x++) {
                    // console.log(x, z, buf[z * 16 + x].toString(16));
                    context.fillStyle = typeToColor(buf[z * 16 + x])
                    context.fillRect(x * blockSize, z * blockSize, blockSize, blockSize);
                }
            }
        } finally {
            context.restore();
        }
        return true;
    }

    async loadMap() {
        try {
            const res = await fetchClient('/map/chunk/' + this.props.x + '/' + this.props.z);
            if (res.error_code !== 0 ||
                res.result_code !== 0) {
                throw new Error(`There was an error fetching map data.`);
            }
            const data = res.data;
            if (!data.available) {
                throw new Error(`Area not available for "${this.props.x}", "${this.props.z}".`);
            }
            if (!this.ready) {
                return;
            }
            this.setState({
                data: Base64Binary.decodeArrayBuffer(data.map)
            });
        } catch(e) {
            if (!this.ready) {
                return;
            }
            this.setState({
                data: e
            });
        }
    }

    componentWillUnmount() {
        this.ready = false;
    }

    componentDidMount() {
        this.setState({
            data: null
        });
        this.ready = true;
        this.loadMap();
    }

    render() {
        return (
            <canvas ref={e => this.canvas = e} style={Object.assign({ width: this.props.size + 'px', height: this.props.size + 'px' }, this.props.style)}></canvas>
        )
    }

};
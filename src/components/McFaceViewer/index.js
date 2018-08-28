import React, { Component } from 'react';

import Face from '@material-ui/icons/Face';
import fetchImage from '../../utils/fetchImage';

const steveImg = 'data:image/png;base64,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';

const pad2 = t => `0${t.toString(16)}`.substr(-2);

export default class McFaceViewer extends Component {

    state = {
        imageData: null
    }

    ref = {
        canvas: null
    }

    drawImage() {
        const imageData = this.state.imageData;
        if (imageData === null || imageData instanceof Error) {
            return;
        }
        const context = this.ref.canvas.getContext('2d');
        context.save();
        for (let i = 0; i < imageData.length; i+=4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            // const rgba = `#${pad2(r)}${pad2(g)}${pad2(b)}${pad2(a)}`;
            const rgba = `rgba(${r}, ${g}, ${b}, ${a/ 256})`;

            const x = (i / 4) % 8;
            const y = Math.floor(i / 4 / 8);
            context.fillStyle = rgba;
            context.fillRect(x * 3, y * 3, 3, 3);
        }
        context.restore();
    }
    
    getImageData(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
                canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size
    
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
    
                resolve(context.getImageData(8, 8, 8, 8).data);
            };
    
            image.onerror = function () {
                reject(new Error(`Error loading image.`));
            }
    
            image.src = url;
        })
    }

    async loadImage() {
        try {
            let url = steveImg;
            try {
                url = await fetchImage(this.props.uri);
            } catch(e) {
                console.error(e);
            }
            const imageData = await this.getImageData(url);
            this.setState({
                imageData: imageData
            });
        } catch(e) {
            this.setState({
                imageData: e
            });
        }
    }

    componentDidMount() {
        this.loadImage();
    }

    componentDidUpdate(prevProps) {
        this.drawImage();
    }
    
    render() {
        const imageData = this.state.imageData;
        return (
            <span style={{width: '24px', height: '24px', display: 'inline-block'}}>
                {
                    (imageData === null || imageData instanceof Error)
                    ? (<Face />)
                    : (<canvas ref={e => this.ref.canvas = e} style={{width: '24px', height: '24px', display: 'inline-block'}} width={24} height={24} />)
                }
            </span>
        );
    }

}
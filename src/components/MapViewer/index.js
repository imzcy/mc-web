import React, { Component } from 'react';
import Chunk from './Chunk';

export default class MapViewer extends Component {

    state = {
        centerX: 0,
        centerY: 0,
        drawAreaX: null,
        drawAreaY: null,
        drawAreaWidth: null,
        drawAreaHeight: null,
        loaded: false
    }

    constructor(props) {
        super(props);
        // this.handlerMouseDown = this.onMouseDown.bind(this);
        this.handlerMouseUp = this.onMouseUp.bind(this);
        this.handlerMouseMove = this.onMouseMove.bind(this);
        this.handlerTouchUp = this.onTouchUp.bind(this);
        this.handlerTouchMove = this.onTouchMove.bind(this);
        this.handlerResize = this.onResize.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        this.onResize();
    }

    onTouchStart(e) {
        this.dragStart = true;
        this.begX = this.state.centerX;
        this.begY = this.state.centerY;
        this.dragX = e.touches[0].pageX;
        this.dragY = e.touches[0].pageY;
    }

    onTouchUp(e) {
        this.dragStart = false;
        this.dragX = null;
        this.dragY = null;
    }

    onTouchMove(e) {
        if (!this.dragStart) {
            return;
        }
        // console.log(this.begX + e.pageX - this.dragX, this.begY + e.pageY - this.dragY);
        this.setState({
            centerX: this.begX + e.touches[0].pageX - this.dragX,
            centerY: this.begY + e.touches[0].pageY - this.dragY
        });
    }

    onMouseDown(e) {
        this.dragStart = true;
        this.begX = this.state.centerX;
        this.begY = this.state.centerY;
        this.dragX = e.pageX;
        this.dragY = e.pageY;
    }

    onMouseUp(e) {
        this.dragStart = false;
        this.dragX = null;
        this.dragY = null;
    }

    onMouseMove(e) {
        if (!this.dragStart) {
            return;
        }
        // console.log(this.begX + e.pageX - this.dragX, this.begY + e.pageY - this.dragY);
        this.setState({
            centerX: this.begX + e.pageX - this.dragX,
            centerY: this.begY + e.pageY - this.dragY
        });
    }

    onResize() {
        const height = this.outerDiv.clientHeight;
        const width = this.outerDiv.clientWidth;

        const newState = {
            drawAreaX: -this.state.centerX - width / 2,
            drawAreaY: -this.state.centerY - height / 2,
            drawAreaWidth: width,
            drawAreaHeight: height
        }
        if (this.state.drawAreaX === newState.drawAreaX &&
            this.state.drawAreaY === newState.drawAreaY &&
            this.state.drawAreaWidth === newState.drawAreaWidth &&
            this.state.drawAreaHeight === newState.drawAreaHeight) {
            return;
        }
        this.setState(newState);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 50);
        window.addEventListener('resize', this.handlerResize);
        // this.outerDiv.addEventListener('mousedown', this.handlerMouseDown);
        document.addEventListener('mousemove', this.handlerMouseMove);
        document.addEventListener('mouseup', this.handlerMouseUp);
        document.addEventListener('touchmove', this.handlerTouchMove);
        document.addEventListener('touchup', this.handlerTouchUp);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handlerResize);
        // this.outerDiv.removeEventListener('mousedown', this.handlerMouseDown);
        document.removeEventListener('mousemove', this.handlerMouseMove);
        document.removeEventListener('mouseup', this.handlerMouseUp);
        document.removeEventListener('touchmove', this.handlerTouchMove);
        document.removeEventListener('touchup', this.handlerTouchUp);
    }

    render() {
        const mapTiles = [];
        const size = parseInt(this.props.size, 10);
        if (
            this.state.drawAreaX !== null &&
            this.state.drawAreaY !== null &&
            this.state.drawAreaWidth !== null &&
            this.state.drawAreaHeight !== null) {
            const tileXBegin = Math.floor(this.state.drawAreaX / size);
            const tileXEnd = Math.ceil((this.state.drawAreaX + this.state.drawAreaWidth) / size);
            const tileYBegin = Math.floor(this.state.drawAreaY / size);
            const tileYEnd = Math.ceil((this.state.drawAreaY + this.state.drawAreaHeight) / size);
            // console.log(tileXBegin, tileXEnd, tileYBegin, tileYEnd);
            for (let x = tileXBegin - 1; x <= tileXEnd; x++) {
                for (let z = tileYBegin - 1; z <= tileYEnd; z++) {
                    mapTiles.push((
                        <Chunk key={`tile.${x}.${z}`} style={{
                            position: 'absolute', 
                            left: (this.state.drawAreaWidth / 2 + x * size) + 'px', 
                            top: (this.state.drawAreaHeight / 2 + z * size) + 'px'
                        }} size={this.props.size} x={x} z={z} />
                    ));
                }
            }
        }
        return (
            <div ref={e => this.outerDiv = e} style={Object.assign({ position: 'relative', overflow: 'hidden' }, this.props.style)} onMouseDown={this.onMouseDown.bind(this)} onTouchStart={this.onTouchStart.bind(this)}>
                <div style={{ position: 'absolute', overflow: 'visible', left: `${this.state.centerX}px`, top: `${this.state.centerY}px` }}>
                    {mapTiles}
                </div>
                <div style={{position: 'absolute'}}>
                    <p><span>X: {(-this.state.centerX / size * 16).toFixed(0)}</span></p>
                    <p><span>Z: {(-this.state.centerY / size * 16).toFixed(0)}</span></p>
                </div>
            </div>
        );
    }

};
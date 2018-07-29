import React, { Component } from 'react';

import MapViewer from '../../components/MapViewer';

export default class Maps extends Component {
    
    render() {
        return (
            <MapViewer size="128" style={{ position: 'absolute', width: '100%', height: '100%' }} />
        );
    }

}
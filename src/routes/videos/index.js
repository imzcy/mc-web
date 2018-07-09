import url from 'url';

import React, { Component } from 'react';
import fetchClient from '../../utils/fetchClient';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Face from '@material-ui/icons/Face';
import CancelableTimer from '../../utils/CancelableTimer';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
// import styles from './style.css';
import ReactPlayer from 'react-player';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class Videos extends Component {

    listOfVideos() {
        return [
            {
                title: "2018-07-01",
                videos: [
                    {
                        title: 'Beacon 1',
                        url: '/videos/beacon-1.mp4'
                    },
                    {
                        title: 'Dragon 1',
                        url: '/videos/dragon-1.mp4'
                    },
                    {
                        title: 'Dragon 2',
                        url: '/videos/dragon-2.mp4'
                    }
                ]
            }
        ]
    }

    render() {
        const videos = this.listOfVideos();
        return (
            <div style={{overflowY: 'auto', position: 'relative', 'top': '0px', 'bottom': '0px', left: '0px', right: '0px'}}>
                <List component="nav">
                    {
                        videos.map(({ title: title_section, videos: videos }, index) => {
                            return (
                                <div>
                                    <Typography variant="headline" component="h3">{title_section}</Typography>
                                    <Grid container spacing={24}>
                                    {
                                        videos.map(({ title: title_video, url }) => {
                                            return (
                                                <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                                                    <Paper style={{'padding': '4px 4px 0px'}}>
                                                        <ReactPlayer key={`video-${index}`} url={url} controls="true" width="100%" height="auto" />
                                                        <Typography component="p">{title_video}</Typography>
                                                    </Paper>
                                                </Grid>
                                            );
                                        })
                                    }
                                    </Grid>
                                </div>
                            );
                        })
                    }
                </List>
            </div>
        );
    }

};
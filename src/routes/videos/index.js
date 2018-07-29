import React, { Component } from 'react';
import List from '@material-ui/core/List';
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
            <List component="nav">
                {
                    videos.map(({ title: title_section, videos }, index) => {
                        return (
                            <div key={`video-${index}`}>
                                <Typography variant="headline" component="h3">{title_section}</Typography>
                                <Grid container spacing={24}>
                                {
                                    videos.map(({ title: title_video, url }, index_i) => {
                                        return (
                                            <Grid key={`video-${index}-${index_i}`} item xs={12} sm={12} md={12} lg={6} xl={4}>
                                                <Paper style={{'padding': '4px 4px 0px'}}>
                                                    <ReactPlayer url={url} controls={true} width="100%" height="auto" />
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
        );
    }

};
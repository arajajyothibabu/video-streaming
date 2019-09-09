import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
}));

export default function Video({id}) {
    const classes = useStyles();

    return (
        <div>
            <Paper className={classes.root}>
                <video id={id} autoPlay muted />
                <Typography component="p">
                    Paper can be used to build surface or other elements for your application.
                </Typography>
            </Paper>
        </div>
    );
}
import React from 'react'
import {Box, List, ListItem, ListItemText, makeStyles, Paper} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: theme.palette.background.paper,
        padding: 0
    },
}));

export default function PersonOnCall({users, onCallUserId, setOnCallUser}) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Box my={2}>
                Select a person below to put them on support. <b>Teams will be notified of the change.</b>
            </Box>

                <div className={classes.root}>
                    <Paper>
                        <List component="nav" >
                            {users.map(user => (
                                <ListItem
                                    key={`person-on-call-${user.userId}`}
                                    button
                                    selected={onCallUserId === user.userId}
                                    onClick={() => setOnCallUser(user.userId)}
                                >
                                    <ListItemText primary={user.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </div>

        </React.Fragment>
    )

}
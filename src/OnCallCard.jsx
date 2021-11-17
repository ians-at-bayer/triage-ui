import React from 'react'
import {Box, Card, CardContent, Paper, Typography} from "@material-ui/core";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLoading, setNotification} from "./action";
import api from "./API";

export default function OnCallCard() {

    const { teamId } = useParams()
    const dispatch = useDispatch()
    const setLoadingDispatch = (on) => dispatch(setLoading(on))
    const setNotificationDispatch = (msg) => dispatch(setNotification(msg))

    const [onCallInfo, setOnCallInfo] = React.useState(null)
    const [date, setDate] = React.useState(null)
    const [gotData, setGotData] = React.useState(false)

    if (gotData === false) {
        setLoadingDispatch(true)

        api.getOnCallUserForTeam(teamId)
            .then(res => {
                setOnCallInfo(res.body)
                setDate(new Date(Date.parse(res.body.until)))
            }).catch(err => {
                const msg = (err.response && err.response.body) ? err.response.body.errorMessage : 'Please contact support if the problem persists'
                setNotificationDispatch({message: 'Failed to load the contact card. ' + msg, type: 'error'})
            }).finally(() => {
                setLoadingDispatch(false)
                setGotData(true)
            })
    }

    return (
        <Box m={4}>
            <Paper style={{width: '600px', padding: '10px'}}>
                <Box m={2}>
                    <Typography variant='h5'>Support Triage Manager - On Call Card</Typography>
                </Box>

                <Box my={5} mx={2} style={{width: '400px'}}>
                    {onCallInfo !== null && (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {onCallInfo.teamName}
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                                {onCallInfo.name} is currently on call
                            </Typography>
                                <Box m={1}>
                                    <Typography variant="body1" component="p">
                                        <b>User ID:</b> {onCallInfo.userId}
                                    </Typography>
                                </Box>
                                <Box m={1}>
                                    <Typography variant="body1" component="p"><b>On Call Until:</b> {date ? date.toLocaleString(): ''}</Typography>
                                </Box>
                        </CardContent>
                    </Card>
                    )}
                </Box>
            </Paper>
        </Box>
    )
}
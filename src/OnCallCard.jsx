import React from 'react'
import {Box, Card, CardContent, Paper, Typography} from "@material-ui/core";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLoading, setNotification} from "./action";
import api from "./API";

export default function OnCallCard() {

    const { teamId } = useParams()

    const dispatch = useDispatch()
    const setNotificationDispatch = (msg) => dispatch(setNotification(msg))
    const setLoadingDispatch = (on) => dispatch(setLoading(on))

    const [onCallInfo, setOnCallInfo] = React.useState(null)

    const fetchOnCallCardData = () => {
        setLoadingDispatch(true)

        api.getOnCallUserForTeam(teamId)
            .then(res => {
                setOnCallInfo(res.body)
                setLoadingDispatch(false)
            })
            .catch(err => setLoadingDispatch(false))
    }

    fetchOnCallCardData()

    return (
        <Box m={4}>
            <Paper style={{width: '600px', padding: '10px'}}>
                <Box m={2}>
                    <Typography variant='h5'>Support Triage Manager - On Call Card</Typography>
                </Box>

                <Box my={5} mx={2} style={{width: '300px'}}>


                    {onCallInfo !== null && (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {onCallInfo.teamName}
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                                {onCallInfo.name} is currently on call
                            </Typography>
                            <Typography variant="body2" component="p">
                                <Box m={1}>
                                    <b>Slack:</b> {onCallInfo.name} (<a href={'https://monslacko.slack.com/team/' + onCallInfo.slackId} target="_blank">{onCallInfo.slackId}</a>)
                                </Box>
                                <Box m={1}>
                                    <b>On Call Until:</b> {onCallInfo.until ? onCallInfo.until.toLocaleString() : ''}
                                </Box>
                            </Typography>
                        </CardContent>
                    </Card>
                    )}

                    {onCallInfo === null && (
                        <Box m={5} style={{width: '300px'}}>
                            Couldn't load the on call card. Are you sure the URL is correct?
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    )
}
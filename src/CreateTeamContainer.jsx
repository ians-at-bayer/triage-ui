import React from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button, Card, Divider,
    Grid, makeStyles, Paper,
    TextField,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import RotationScheduler from "./RotationScheduler";
import SlackConfiguration from "./SlackConfiguration";
import TeamMembersConfiguration from "./TeamMembersConfiguration";
import {useDispatch} from "react-redux";
import {setLoading, setNotification, wait} from "./action";
import api from "./API";
import {parseDateTimeStrings} from "./Util";

export default function CreateTeamContainer({userName, userId}) {

    const dispatch = useDispatch()
    const setNotificationDispatch = (msg) => dispatch(setNotification(msg))
    const setLoadingDispatch = (on) => dispatch(setLoading(on))

    const [expanded, setExpanded] = React.useState(false)
    const [teamName, setTeamName] = React.useState("")
    const [selectedFreq, setSelectedFreq] = React.useState(7)
    const [selectedDate, setSelectedDate] = React.useState("2020-01-01")
    const [selectedTime, setSelectedTime] = React.useState("09:00")
    const [slackHookUrl, setSlackHookUrl] = React.useState("http://yourslackhookurlhere/")
    const [slackMessage, setSlackMessage] = React.useState("Hi I'm [name] and I'm on support this week. Feel free to DM me [slackid] or my team <!subteam^S6SQ21GSC|Triton Dev Team>. If you want to keep up with who is on support, try using our <[cardurl]|contact card>. It always has the latest support info for our team.")
    const [users, updateUsers] = React.useState([{id: 0, slackId: userId, name: userName},{id: 1, slackId: '', name: ''}])

    const firstUserName = users[0] ? users[0].name : null

    const createTeam = () => {
        if (selectedDate === null || teamName === '' || slackHookUrl === '' || slackMessage === '') {
            setNotificationDispatch({message: "Failed to create team: All form fields must be filled before submitting", type: 'error'})
            return
        }

        if (users.find(user => user.slackId === '' || user.name === '') !== undefined) {
            setNotificationDispatch({message: "Failed to create team: All user fields must be filled before submitting", type: 'error'})
            return
        }

        const {year, month, day, hour, minute} = parseDateTimeStrings(selectedTime, selectedDate);

        if (year < new Date().getFullYear()) {
            dispatch(setNotification({message: "Invalid year. The year must be on or after the current year.", type: 'error'}))
            return
        }

        const nextRotation = new Date(year, month, day, hour, minute, 0)

        if (nextRotation.getTime() <= new Date().getTime()) {
            dispatch(setNotification({message: "Invalid date and time. The date and time must be after the current time. ", type: 'error'}))
            return
        }

        setLoadingDispatch(true)
        api.setupTeam(teamName, nextRotation.toISOString(), selectedFreq, slackHookUrl, slackMessage, users)
            .then(res => {
                setLoadingDispatch(false)
                setNotificationDispatch({message: "Team created successfully" , type: 'info'})
                wait().then(() => window.location.reload(false))
            }).catch(err => {
                setLoadingDispatch(false)

                if (err.response.body !== undefined && err.response.body !== null) {
                    setNotificationDispatch({message: "Failed to create team: " + err.response.body.errorMessage , type: 'error'})
                } else {
                    setNotificationDispatch({message: "Failed to create team" , type: 'error'})
                }
            })
    }

    return (
        <React.Fragment>
            <Box my={2}>
                <Paper>
                    <Box p={3}>
                        <Box>
                            <Typography variant="h4">Support Triage Manager</Typography>
                        </Box>

                        <Box my={2}>
                            The Support Triage Manager tracks and manages the support rotation schedule for your team.
                            It automatically posts messages to Slack when the rotation order changes so team members
                            and users know who is in charge of support.
                        </Box>

                        <Box my={2}>
                            <b>To join a team</b>, get in contact with your team members so they can add you to their
                            team account.
                        </Box>

                        <Box my={2}>
                            <b>To create a new team</b>, click "Create a New Team" below to get started.
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
                <AccordionSummary
                    style={{backgroundColor: 'rgba(0, 0, 0, .03)'}}
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h5">Create a New Team</Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <Grid container spacing={3}>

                        <Grid item xs={12}>
                            <Paper variant="outlined" style={{padding: '10px'}}>
                                <Typography variant="h6">Name Your Team</Typography>

                                <Box my={2}>
                                <TextField style={{width: '700px'}} variant='outlined' id="team-name"
                                           onChange={e => setTeamName(e.target.value)} label="Team Name"
                                           value={teamName} inputProps={{ maxLength: 50 }}/>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper variant="outlined" style={{padding: '10px'}}>
                                <Typography variant="h6">Setup Your Rotation Order</Typography>

                                <Box my={2}>
                                    <TeamMembersConfiguration requiredUsers={[userId]} users={users} updateUsers={updateUsers} setNotification={setNotificationDispatch}/>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper variant="outlined" style={{padding: '10px'}}>
                                <Typography variant="h6">Setup Your Rotation Schedule</Typography>

                                <Box my={2}>
                                    <RotationScheduler selectedTime={selectedTime} setSelectedTime={setSelectedTime}
                                                       selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                                                       selectedFreq={selectedFreq} setSelectedFreq={setSelectedFreq}/>

                                </Box>
                            </Paper>
                        </Grid>

                        <Grid  item xs={12}>
                            <Paper variant="outlined" style={{padding: '10px'}}>
                                <Typography variant="h6">Setup Your Slack Hook</Typography>

                                <Box my={2}>
                                    <SlackConfiguration slackHookUrl={slackHookUrl}
                                                        handleSlackHookUrlChange={setSlackHookUrl}
                                                        slackMessage={slackMessage}
                                                        handleSlackMessageChange={setSlackMessage}/>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper variant="outlined" style={{padding: '10px'}}>
                                <Box my={2}>
                                    When you click the "Create Team" button, {firstUserName ? firstUserName + ' (the first team member in the rotation order)' : 'the first team member in the rotation order'} will be put on support until {selectedDate} at {selectedTime}. <b>Slack will be notified of this immediately.</b>
                                </Box>
                                <Box my={2}>
                                    <Button variant="contained" color="primary" onClick={createTeam}>Create Team</Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </React.Fragment>
    )

}
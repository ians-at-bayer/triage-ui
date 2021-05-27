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
import {setLoading, setNotification} from "./action";
import api from "./API";
import {createRotationDate} from "./Util";

export default function CreateTeamContainer({userName, userId}) {

    const dispatch = useDispatch()
    const setNotificationDispatch = (msg) => dispatch(setNotification(msg))
    const setLoadingDispatch = (on) => dispatch(setLoading(on))

    const [expanded, setExpanded] = React.useState(false)
    const [teamName, setTeamName] = React.useState("")
    const [selectedFreq, setSelectedFreq] = React.useState(7)
    const [selectedDate, setSelectedDate] = React.useState(createRotationDate('09', '00', selectedFreq))
    const [slackHookUrl, setSlackHookUrl] = React.useState("http://yourslackhookurlhere/")
    const [slackMessage, setSlackMessage] = React.useState("Hi I'm [name] and I'm on support this week. Feel free to DM me <@[slackid]> or my team <!subteam^S6SQ21GSI|ABC Dev Team>. If you want to keep up with who is on support, try using our <[cardurl]|contact card>. It always has the latest support info for our team.")
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

        setLoadingDispatch(true)
        api.setupTeam(teamName, selectedDate.toISOString(), selectedFreq, slackHookUrl, slackMessage, users)
            .then(res => {
                setLoadingDispatch(false)
                setNotificationDispatch({message: "Team created successfully" , type: 'info'})
                waitThenReload.then(() => window.location.reload(false))
            }).catch(err => {
                setLoadingDispatch(false)

                if (err.response.body !== undefined && err.response.body !== null) {
                    setNotificationDispatch({message: "Failed to create team: " + err.response.body.errorMessage , type: 'error'})
                } else {
                    setNotificationDispatch({message: "Failed to create team" , type: 'error'})
                }
            })
    }

    const waitThenReload = new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, 2500)
    })

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
                                <TextField style={{width: '500px'}} variant='outlined' id="team-name"
                                           onChange={e => setTeamName(e.target.value)} label="Team Name"
                                           value={teamName} inputProps={{ maxLength: 50 }}/>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper variant="outlined" style={{padding: '10px'}}>
                                <Typography variant="h6">Setup Your Rotation Schedule</Typography>

                                <Box my={2}>
                                    <RotationScheduler selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                                                       selectedFreq={selectedFreq} setSelectedFreq={setSelectedFreq}/>

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
                                <Typography variant="h6">For Your Information</Typography>
                                <Box my={2}>
                                    When you click the "Create Team" button:
                                    <ul>
                                        <li>{firstUserName ? firstUserName + ' (the first team member given in the rotation order)' : 'The first team member given in the rotation order'} will be put on support for {selectedFreq} days</li>
                                        <li>Slack will be notified that {firstUserName ? firstUserName : 'the first user above'} is on support using your Slack hook immediately</li>
                                        <li>Every {selectedFreq} day(s) the person on support will rotate at {selectedDate instanceof Date && isFinite(selectedDate) ? selectedDate.toLocaleTimeString() : 'the given'} local time according to the rotation schedule. Slack will be notified each time.</li>
                                    </ul>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={createTeam}>Create Team</Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </React.Fragment>
    )

}
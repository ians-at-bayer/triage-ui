import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {AppBar, Box, Button, Paper, Tab, Tabs, TextField, Typography} from "@material-ui/core";
import api from "./API";
import {
    handleSaveRotation,
    handleSaveSlackSettings,
    handleSaveTeamMembers,
    handleSaveTeamName,
    handleSendSlackMessage,
    handleSetOnCallPerson,
    setLoading,
    setNotification
} from "./action";
import PropTypes from "prop-types";
import RotationScheduler from "./RotationScheduler";
import TeamMembersConfiguration from "./TeamMembersConfiguration";
import SlackConfiguration from "./SlackConfiguration";
import PersonOnCall from "./PersonOnCall";
import {ChickenTestDialog} from "./ChickenTestDialog";

export class ManageTeamContainer extends React.Component {

    constructor() {
        super()

        this.state = {
            selectedTab: 0,

            teamName: '',
            teamMembers: [],
            teamMembersForOnCall: [],

            rotationFreq: 1,
            rotationTime: new Date(),

            slackHookUrl: '',

            onCallUserId: '',
            selectedOnCallUserId: '',

            showSlackMsgChickenTest: false,
            showChangeOnCallChickenTest: false
        }
    }

    componentDidMount() {
        const { loadTeamSetup } = this.props

        setLoading(true)

        Promise.all([api.getTeamSetup(), api.getOnCalluser()])
            .then(values => {
                const teamSetup = values[0].body
                const onCallPerson = values[1].body
                const peopleTransformer = (people) => Array.from(people, (people, i) => ({id: i, slackId: people.slackId, name: people.name}))
                const teamMembers = peopleTransformer(teamSetup.people)

                const newState = {
                    teamName: teamSetup.teamName,
                    teamMembers: teamMembers,
                    teamMembersForOnCall: teamMembers,

                    rotationFreq: teamSetup.rotationConfig.rotationFrequencyDays,
                    rotationTime: new Date(Date.parse(teamSetup.rotationConfig.nextRotationTime)),

                    slackHookUrl: teamSetup.slackConfig.slackHookUrl,
                    slackHookMessage: teamSetup.slackConfig.slackMessage,

                    onCallUserId: onCallPerson.slackId,
                    selectedOnCallUserId: onCallPerson.slackId
                }

                this.setState(newState)

                setLoading(false)
        }).catch(error => {
            setLoading(false)
            setNotification({message: 'Cannot load your team details. Please contact support if the problem persists', type: 'error'})
            console.log(error)
        })
    }

    tabPanelProps(index) { return {id: `full-width-tab-${index}`, 'aria-controls': `full-width-tabpanel-${index}`}}
    tabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        {children}
                    </Box>
                )}
            </div>
        )
    }

    render() {

        const { userId, setNotification, handleSaveRotation, handleSaveSlackSettings, handleSendSlackMessage,
            handleSaveTeamMembers, handleSaveTeamName, handleSetOnCallPerson } = this.props
        const {selectedTab, teamName, rotationTime, rotationFreq, teamMembers, slackHookUrl, slackHookMessage,
            onCallUserId, selectedOnCallUserId, teamMembersForOnCall, showSlackMsgChickenTest, showChangeOnCallChickenTest } = this.state
        const TabPanel = this.tabPanel

        const handleSetTeamName = (teamName) => this.setState({teamName})
        const handleSetRotationTime = (rotationTime) => this.setState({rotationTime})
        const handleSetRotationFreq = (rotationFreq) => this.setState({rotationFreq})
        const handleSetTeamMembers = (teamMembers) => this.setState( {teamMembers})
        const handleSetSlackHookUrl = (slackHookUrl) => this.setState({slackHookUrl})
        const handleSetSlackMessage = (slackHookMessage) => this.setState({slackHookMessage})
        const handleSetOnCallUser = (slackId) => this.setState({selectedOnCallUserId: slackId})
        const handleSelectTab = (event, newValue) => this.setState({selectedTab: newValue})
        const handleSlackMsgChickenTest = (bool) => this.setState({showSlackMsgChickenTest: bool})
        const handleChangeOnCallChickenTest = (bool) => this.setState({showChangeOnCallChickenTest: bool})

        const saveRotation = () => handleSaveRotation(rotationFreq, rotationTime)
        const saveSlackSettings = () => handleSaveSlackSettings(slackHookUrl, slackHookMessage)
        const sendSlackMessage = () => handleSendSlackMessage()
        const saveTeamName = () => handleSaveTeamName(teamName)
        const saveOnCallPerson = () => handleSetOnCallPerson(selectedOnCallUserId)
            .then(res => this.setState({onCallUserId: selectedOnCallUserId})) //update the on call user id in state if changing it successfully
        const saveTeamMembers = () => handleSaveTeamMembers(teamMembers)
            .then(res => this.setState({teamMembersForOnCall: teamMembers})) //update team members on call if successfully saved the new team members

        return (
            <React.Fragment>
                <Paper>
                    <Box my={2}>
                        <Typography variant="h4">Support Triage Manager</Typography>
                    </Box>
                    <AppBar position="static">
                        <Tabs value={selectedTab} onChange={handleSelectTab} aria-label="simple tabs example">
                            <Tab label="Team Info" {...this.tabPanelProps(0)} />
                            <Tab label="Person On Call" {...this.tabPanelProps(1)} />
                            <Tab label="Team Members" {...this.tabPanelProps(2)} />
                            <Tab label="Slack" {...this.tabPanelProps(3)} />
                            <Tab label="Rotation Schedule" {...this.tabPanelProps(4)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={selectedTab} index={0}>
                        <Box my={2}>
                            <TextField style={{width: '500px'}} variant='outlined' id="team-name" label="Team Name"
                                       onChange={e => handleSetTeamName(e.target.value)}
                                       value={teamName} inputProps={{ maxLength: 50 }}/>
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveTeamName}>Save</Button>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={1}>
                        <Box my={2}>
                            <PersonOnCall users={teamMembersForOnCall} onCallUserId={selectedOnCallUserId} setOnCallUser={handleSetOnCallUser} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={() => handleChangeOnCallChickenTest(true)}>Save</Button>
                        <ChickenTestDialog isOpen={showChangeOnCallChickenTest} setOpen={handleChangeOnCallChickenTest} actionCallback={saveOnCallPerson}
                                           chickenTestQuestion="Are you sure you want change the on call person? This will notify Slack."/>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={2}>
                        <Box my={2}>
                            <TeamMembersConfiguration setNotification={setNotification} updateUsers={handleSetTeamMembers}
                                                      users={teamMembers} requiredUsers={[userId, onCallUserId]} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveTeamMembers}>Save</Button>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={3}>
                        <Box my={2}>
                            <SlackConfiguration slackHookUrl={slackHookUrl} slackMessage={slackHookMessage}
                                                handleSlackHookUrlChange={handleSetSlackHookUrl} handleSlackMessageChange={handleSetSlackMessage} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveSlackSettings}>Save</Button>

                        &nbsp;

                        <Button variant="contained" color="secondary" onClick={() => handleSlackMsgChickenTest(true)}>Send Slack Message</Button>
                        <ChickenTestDialog isOpen={showSlackMsgChickenTest} setOpen={handleSlackMsgChickenTest} actionCallback={sendSlackMessage}
                                           chickenTestQuestion="Are you sure you want to send a Slack message? This will not change who is on support."/>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={4}>
                        <Box my={2}>
                            <RotationScheduler selectedDate={rotationTime} setSelectedDate={handleSetRotationTime}
                                               selectedFreq={rotationFreq} setSelectedFreq={handleSetRotationFreq} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveRotation}>Save</Button>
                    </TabPanel>
                </Paper>
            </React.Fragment>
        )
    }
}


ManageTeamContainer.propTypes = {
    userId: PropTypes.string,
    teamSetup: PropTypes.object
}

ManageTeamContainer.defaultProps = {
    userId: '',
    teamSetup: undefined
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setLoading, setNotification, handleSaveRotation, handleSaveSlackSettings, handleSendSlackMessage,
    handleSaveTeamMembers, handleSaveTeamName, handleSetOnCallPerson
}, dispatch)

export default connect(state => ({
    userId: state.get('userId'),
    teamSetup: state.get('teamSetup'),
}), mapDispatchToProps)(ManageTeamContainer)
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {AppBar, Box, Button, Paper, Tab, Tabs, TextField, Typography} from "@material-ui/core";
import api from "./API";
import {
    handleDeleteTeam,
    handleSaveRotation,
    handleSaveTeamsSettings,
    handleSaveTeamMembers,
    handleSaveTeamName,
    handleSendTeamsMessage,
    handleSetOnCallPerson,
    setLoading,
    setNotification,
    handleChatbotSettings
} from "./action";
import PropTypes from "prop-types";
import RotationScheduler from "./RotationScheduler";
import TeamMembersConfiguration from "./TeamMembersConfiguration";
import TeamsConfiguration from "./TeamsConfiguration";
import PersonOnCall from "./PersonOnCall";
import {ChickenTestDialog} from "./ChickenTestDialog";
import {padTimeUnit} from "./Util";
import ChatbotConfiguration from "./ChatbotConfiguration";

export class ManageTeamContainer extends React.Component {

    constructor() {
        super()

        this.state = {
            selectedTab: 0,

            teamName: '',
            teamMembers: [],
            teamMembersForOnCall: [],

            rotationFreq: 1,
            rotationTime: "09:00",
            rotationDate: "2020-01-01",

            hookUrl: '',
            chatbotId: null,

            onCallUserId: '',
            selectedOnCallUserId: '',

            showMsgChickenTest: false,
            showChangeOnCallChickenTest: false,
            showDeleteTeamChickenTest: false
        }
    }

    componentDidMount() {
        const { loadTeamSetup } = this.props

        setLoading(true)

        Promise.all([api.getTeamSetup(), api.getOnCalluser()])
            .then(values => {
                const teamSetup = values[0].body
                const onCallPerson = values[1].body
                const peopleTransformer = (people) => Array.from(people, (people, i) => ({id: i, userId: people.userId, name: people.name}))
                const teamMembers = peopleTransformer(teamSetup.people)

                const rotationDate = new Date(Date.parse(teamSetup.rotationConfig.nextRotationTime))

                const newState = {
                    teamName: teamSetup.teamName,
                    teamMembers: teamMembers,
                    teamMembersForOnCall: teamMembers,

                    rotationFreq: teamSetup.rotationConfig.rotationFrequencyDays,
                    rotationTime: padTimeUnit(rotationDate.getHours()) + ":" + padTimeUnit(rotationDate.getMinutes()),
                    rotationDate: rotationDate.getFullYear() + "-" + padTimeUnit(rotationDate.getMonth()+1) + "-" + padTimeUnit(rotationDate.getDate()),

                    hookUrl: teamSetup.teamsConfig.hookUrl,
                    chatbotId: teamSetup.chatbotId,
                    hookMessage: teamSetup.teamsConfig.message,

                    onCallUserId: onCallPerson.userId,
                    selectedOnCallUserId: onCallPerson.userId
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

        const { userId, setNotification, handleSaveRotation, handleSaveTeamsSettings, handleSendTeamsMessage,
            handleSaveTeamMembers, handleSaveTeamName, handleSetOnCallPerson, handleDeleteTeam, teamId, handleChatbotSettings } = this.props
        const {selectedTab, teamName, rotationTime, rotationFreq, teamMembers, hookUrl, hookMessage,
            onCallUserId, selectedOnCallUserId, teamMembersForOnCall, showMsgChickenTest, showChangeOnCallChickenTest,
            showDeleteTeamChickenTest, rotationDate, chatbotId } = this.state
        const TabPanel = this.tabPanel

        const handleSetTeamName = (teamName) => this.setState({teamName})
        const handleSetRotationTime = (rotationTime) => this.setState({rotationTime})
        const handleSetRotationDate = (rotationDate) => this.setState({rotationDate})
        const handleSetRotationFreq = (rotationFreq) => this.setState({rotationFreq})
        const handleSetTeamMembers = (teamMembers) => this.setState( {teamMembers})
        const handleSetTeamsHookUrl = (hookUrl) => this.setState({hookUrl})
        const handleSetTeamsMessage = (hookMessage) => this.setState({hookMessage})
        const handleSetChatbotId = (chatbotId) => this.setState({chatbotId})
        const handleSetOnCallUser = (userId) => this.setState({selectedOnCallUserId: userId})
        const handleSelectTab = (event, newValue) => this.setState({selectedTab: newValue})
        const handleTeamsMsgChickenTest = (bool) => this.setState({showMsgChickenTest: bool})
        const handleChangeOnCallChickenTest = (bool) => this.setState({showChangeOnCallChickenTest: bool})
        const handleDeleteTeamChickenTest = (bool) => this.setState({showDeleteTeamChickenTest: bool})

        const saveRotation = () => handleSaveRotation(rotationFreq, rotationTime, rotationDate)
        const saveTeamsSettings = () => handleSaveTeamsSettings(hookUrl, hookMessage)
        const sendTeamsMessage = () => handleSendTeamsMessage()
        const saveTeamsName = () => handleSaveTeamName(teamName)
        const saveChatbotSettings = () => handleChatbotSettings(chatbotId)
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
                            <Tab label="MS Teams" {...this.tabPanelProps(3)} />
                            <Tab label="Rotation Schedule" {...this.tabPanelProps(4)} />
                            <Tab label="myGenAssist Chatbot" {...this.tabPanelProps(5)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={selectedTab} index={0}>
                        <Box my={2}>
                            <TextField style={{width: '500px'}} variant='outlined' id="team-name" label="Team Name"
                                       onChange={e => handleSetTeamName(e.target.value)}
                                       value={teamName} inputProps={{ maxLength: 50 }}/>
                        </Box>
                        <Box my={2}>
                            View or share your team's <a href={'/support-triage-manager/on-call/' + teamId} target="_blank">On Call Card</a>
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveTeamsName}>Save</Button>
                        &nbsp;
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteTeamChickenTest(true)}>Delete Team</Button>
                        <ChickenTestDialog isOpen={showDeleteTeamChickenTest} setOpen={handleDeleteTeamChickenTest} actionCallback={handleDeleteTeam}
                                           chickenTestQuestion="Are you sure you want to delete your team? You cannot undo this action and all team data will be lost."/>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={1}>
                        <Box my={2}>
                            <PersonOnCall users={teamMembersForOnCall} onCallUserId={selectedOnCallUserId} setOnCallUser={handleSetOnCallUser} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={() => handleChangeOnCallChickenTest(true)}>Save</Button>
                        <ChickenTestDialog isOpen={showChangeOnCallChickenTest} setOpen={handleChangeOnCallChickenTest} actionCallback={saveOnCallPerson}
                                           chickenTestQuestion="Are you sure you want change the on call person? This will notify Teams."/>
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
                            <TeamsConfiguration hookUrl={hookUrl} message={hookMessage}
                                                handleHookUrlChange={handleSetTeamsHookUrl} handleMessageChange={handleSetTeamsMessage} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveTeamsSettings}>Save</Button>

                        &nbsp;

                        <Button variant="contained" color="secondary" onClick={() => handleTeamsMsgChickenTest(true)}>Send Teams Message</Button>
                        <ChickenTestDialog isOpen={showMsgChickenTest} setOpen={handleTeamsMsgChickenTest} actionCallback={sendTeamsMessage}
                                           chickenTestQuestion="Are you sure you want to send a Teams message? This will not change who is on support."/>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={4}>
                        <Box my={2}>
                            <RotationScheduler selectedTime={rotationTime} setSelectedTime={handleSetRotationTime}
                                               selectedDate={rotationDate} setSelectedDate={handleSetRotationDate}
                                               selectedFreq={rotationFreq} setSelectedFreq={handleSetRotationFreq} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveRotation}>Save</Button>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={5}>
                        <Box my={2}>
                            <ChatbotConfiguration chatbotId={chatbotId} handleChatbotIdChange={handleSetChatbotId} />
                        </Box>

                        <Button variant="contained" color="primary" onClick={saveChatbotSettings}>Save</Button>
                    </TabPanel>
                </Paper>
            </React.Fragment>
        )
    }
}


ManageTeamContainer.propTypes = {
    userId: PropTypes.string,
    teamSetup: PropTypes.object,
    teamId: PropTypes.number
}

ManageTeamContainer.defaultProps = {
    userId: '',
    teamSetup: undefined,
    teamId: null
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setLoading, setNotification, handleSaveRotation, handleSaveTeamsSettings, handleSendTeamsMessage,
    handleSaveTeamMembers, handleSaveTeamName, handleSetOnCallPerson, handleDeleteTeam, handleChatbotSettings
}, dispatch)

export default connect(state => ({
    userId: state.get('userId'),
    teamSetup: state.get('teamSetup'),
    teamId: state.get('teamId')
}), mapDispatchToProps)(ManageTeamContainer)
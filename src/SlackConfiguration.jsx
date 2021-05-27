import React from 'react'
import {Box, TextField, Tooltip, Typography} from "@material-ui/core";
import HelpIcon from '@material-ui/icons/Help'

export default function SlackConfiguration({slackHookUrl, handleSlackHookUrlChange, slackMessage, handleSlackMessageChange}) {

    return (
        <React.Fragment>
            <Box mb={4}>
                See the <b><a href="https://api.slack.com/messaging/webhooks" target="_blank">Slack
                hook docs</a></b> for details on how to create a Slack Hook URL.
                <Tooltip style={{maxWidth: '500', marginLeft: '5px', verticalAlign: 'bottom'}} title={
                    <React.Fragment>
                        <Box my={2}>
                            <Typography variant="body1">
                                Your Slack message will post to your Slack hook URL and display in the channel
                                for your hook when the support person rotates.
                            </Typography>
                        </Box>
                        <Box my={2}>
                            <Typography variant="body1">
                                You can have the Support Triage Manager automatically put information about the
                                active support person using tags like <b>{"[name], [slackid], [cardurl]"}</b> in the Slack
                                message. You can also add tags from Slack, for example: {"<!subteam^S6SQ21GSI|ABC Dev Team>"}&nbsp;
                                is a link to the ABC Dev Team.
                            </Typography>
                        </Box>
                        <Box my={2}>
                            <Typography variant="body1">
                                See the Slack hook docs on the Slack website for more details.
                            </Typography>
                        </Box>
                    </React.Fragment>
                }>
                    <HelpIcon/>
                </Tooltip>
            </Box>
            <Box my={2}>
                <TextField id="slack-hook-url" fullWidth label="Slack Hook Url" style={{width: '700px'}}
                           onChange={(e) => handleSlackHookUrlChange(e.target.value)}
                           value={slackHookUrl} variant='outlined'/>
            </Box>
            <Box my={2}>
                <TextField
                    id="slack-message"
                    fullWidth
                    label="Slack Message"
                    multiline
                    rows={3}
                    variant='outlined'
                    style={{width: '700px'}}
                    value={slackMessage}
                    onChange={(e) => handleSlackMessageChange(e.target.value)}
                />
            </Box>
        </React.Fragment>
    )

}
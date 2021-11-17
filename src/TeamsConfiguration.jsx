import React from 'react'
import {Box, TextField} from "@material-ui/core";

export default function TeamsConfiguration({hookUrl, handleHookUrlChange, message, handleMessageChange}) {

    return (
        <React.Fragment>
            <Box my={2}>
                <TextField id="teams-hook-url" fullWidth label="Teams Hook Url" style={{width: '700px'}}
                           onChange={(e) => handleHookUrlChange(e.target.value)}
                           value={hookUrl} variant='outlined'/>
            </Box>
            <Box my={2}>
                <TextField
                    id="teams-message"
                    fullWidth
                    label="Teams Message"
                    multiline
                    rows={5}
                    variant='outlined'
                    style={{width: '700px'}}
                    value={message}
                    onChange={(e) => handleMessageChange(e.target.value)}
                />
            </Box>
        </React.Fragment>
    )

}
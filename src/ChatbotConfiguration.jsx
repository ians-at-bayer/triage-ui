import React from 'react'
import {Box, TextField} from "@material-ui/core";

export default function ChatbotConfiguration({chatbotId, handleChatbotIdChange}) {

    return (
        <React.Fragment>
            <Box my={2}>
                <p>Offer users a support chatbot on your teams contact card page by providing your myGenAssist assistant ID.</p>
                <TextField id="chatbot-id" fullWidth label="Assistant ID" style={{width: '700px'}}
                           onChange={(e) => handleChatbotIdChange(e.target.value)}
                           value={chatbotId} variant='outlined'/>
            </Box>
        </React.Fragment>
    )

}
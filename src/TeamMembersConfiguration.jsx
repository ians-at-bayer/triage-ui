import React from 'react'
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    TextField,
    Tooltip, Typography
} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { Container, Draggable } from "react-smooth-dnd";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import arrayMove from "array-move";
import HelpIcon from "@material-ui/icons/Help";

export default function TeamMembersConfiguration({users, updateUsers, setNotification, requiredUsers = []}) {

    const minUsers = 2
    const maxUsers = 6

    const areAllFilled = () => {
        return users.find(user => user.slackId === '' || user.name === '') === undefined
    }

    const handleUserNameChange = (id, name) => {
        const usersCopy = [ ... users ]

        usersCopy.find(user => user.id == id).name = name

        updateUsers(usersCopy)
    }

    const handleUserSlackIdChange = (id, newId) => {
        if (newId !== '' && users.find(user => user.slackId == newId) !== undefined) {
            setNotification({message: `Slack ID "${newId}" has already been added to the team`, type: 'error' })
            return
        }

        const usersCopy = [ ... users ]

        usersCopy.find(user => user.id == id).slackId = newId

        updateUsers(usersCopy)

    }

    const handleAddUser = () => {
        if (users.length === maxUsers) return

        const usersCopy = [...users]

        usersCopy.push({id: users.length , slackId: '', name: ''})
        updateUsers(usersCopy)
    }

    const handleRemoveUser = (id) => {
        if (users.length === minUsers) return

        const usersCopy = [ ... users ]
        const userItem = usersCopy.find(user => user.id == id)

        usersCopy.splice(usersCopy.indexOf(userItem),1)

        updateUsers(usersCopy)
    }

    const onDrop = ({ removedIndex, addedIndex }) => updateUsers(arrayMove(users, removedIndex, addedIndex))
    const isRequiredUser = (slackId) => requiredUsers.includes(slackId)

    return (
        <React.Fragment>
            <Box my={2}>
                Team members are listed in the <b>rotation order.</b>
                <Tooltip style={{maxWidth: '500', marginLeft: '5px', marginRight: '5px', verticalAlign: 'bottom'}} title={
                    <React.Fragment>
                        <Box my={2}>
                            <Typography variant="body1">
                                The rotation order determines when members of your team will be put on support.
                                The first team member will go first, the second will go second and onwards for each team member.
                                The person on support advances after each scheduled rotation. When the last person on the team
                                is on support the rotation will advance to the first person, completing a cycle.
                            </Typography>
                        </Box>

                        <Box my={2}>
                            <Typography variant="body1">
                                You can change the rotation order, team members, time, or frequency at any time.
                            </Typography>
                        </Box>
                    </React.Fragment>
                }>
                    <HelpIcon/>
                </Tooltip>
                 Change the rotation order by dragging <DragHandleIcon style={{verticalAlign: 'middle'}} fontSize='small'/> .
            </Box>
            <List style={{maxWidth: '775px', marginLeft: '-20px'}}>
                <Container dragHandleSelector=".drag-handle" onDrop={onDrop}>
                    {users.map(user => (
                        <Draggable key={`${user.id}-draggable`}>
                            <ListItem>
                                    <TextField key={`${user.id}-name`} style={{width: '300px'}} variant='outlined'
                                               label="Team Member Name" onChange={e => handleUserNameChange(user.id, e.target.value)}
                                               value={user.name} inputProps={{ maxLength: 50 }} disabled={isRequiredUser(user.slackId)}/>
                                    <TextField key={`${user.id}-id`} style={{width: '300px'}} variant='outlined'
                                               label="Team Member Slack ID" onChange={e => handleUserSlackIdChange(user.id, e.target.value)}
                                               value={user.slackId} inputProps={{ maxLength: 50 }} disabled={isRequiredUser(user.slackId)}/>

                                <ListItemSecondaryAction>
                                    <ListItemIcon>
                                        <IconButton disabled={users.length <= minUsers || isRequiredUser(user.slackId)} onClick={() => handleRemoveUser(user.id)}>
                                            <RemoveCircleIcon />
                                        </IconButton>
                                    </ListItemIcon>
                                    <ListItemIcon className="drag-handle">
                                        <DragHandleIcon />
                                    </ListItemIcon>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Draggable>
                        )
                    )}
                </Container>
            </List>

            <Box mb={2}>
                <IconButton disabled={users.length >= maxUsers || !areAllFilled()} onClick={handleAddUser}>
                    <AddCircleIcon />
                </IconButton>
            </Box>

        </React.Fragment>
    )

}
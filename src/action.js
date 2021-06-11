import {
    CLEAR_NOTIFICATION,
    SET_FULL_NAME,
    SET_LOADING,
    SET_NOTIFICATION,
    SET_TEAM_ID,
    SET_USER_ID
} from "./action-types";
import api from "./API";
import {parseDateTimeStrings} from "./Util";

export function setUserId(userId) {
    return {type: SET_USER_ID, userId}
}

export function setTeamId(teamId) {
    return {type: SET_TEAM_ID, teamId}
}

export function setUserFullName(fullName) {
    return {type: SET_FULL_NAME, fullName}
}

export function setNotification(notification) {
    return {type: SET_NOTIFICATION, notification}
}

export function clearNotification() {
    return {type: CLEAR_NOTIFICATION}
}

export function setLoading(isLoading) {
    return {type: SET_LOADING, isLoading}
}


export function handleSaveRotation(rotationFreq, rotationTime, rotationDate)  {
    return dispatch => {
        const {year, month, day, hour, minute} = parseDateTimeStrings(rotationTime, rotationDate);

        if (year < new Date().getFullYear()) {
            dispatch(setNotification({message: "Invalid year. The year must be on or after the current year.", type: 'error'}))
            return
        }

        const nextRotation = new Date(year, month, day, hour, minute, 0)

        if (nextRotation.getTime() <= new Date().getTime()) {
            dispatch(setNotification({message: "Invalid date and time. The date and time must be after the current time. ", type: 'error'}))
            return
        }

        return api.saveRotationConfig(rotationFreq, nextRotation.toISOString())
            .then(res => dispatch(setNotification({message: "Saved rotation changes successfully", type: 'info'})))
            .catch(err => {
                dispatch(setNotification({message: "Failed to save rotation changes", type: 'error'}))
                console.log(err)
            })
    }
}

export function handleSaveSlackSettings(slackHookUrl, slackMessage) {
    return dispatch => {
        api.saveSlackConfig(slackHookUrl, slackMessage)
            .then(res => dispatch(setNotification({message: "Saved Slack settings successfully", type: 'info'})))
            .catch(err => {
                dispatch(setNotification({message: "Failed to save Slack settings", type: 'error'}))
                console.log(err)
            })
    }
}

export function handleSendSlackMessage() {
    return dispatch => {
        return api.slackSend().then(res => dispatch(setNotification({message: "Slack message sent successfully", type: 'info'})))
            .catch(err => {
                dispatch(setNotification({message: "Failed to send Slack message. Please try again later.", type: 'error'}))
                console.log(err)
            })
    }
}

export function handleSaveTeamMembers(teamMembers) {
    return dispatch => {
        return api.saveTeamMembers(teamMembers)
            .then(res => dispatch(setNotification({message: "Team members saved successfully", type: 'info'})))
            .catch(err => {
                if (err.response.body !== undefined && err.response.body !== null) {
                    dispatch(setNotification({message: "Failed to save Slack settings: " + err.response.body.errorMessage , type: 'error'}))
                } else {
                    dispatch(setNotification({message: "Failed to save Slack settings" , type: 'error'}))
                }

                console.log(err)
            })
    }
}

export function handleSaveTeamName(teamName) {
    return dispatch => {
        return api.saveTeamName(teamName)
            .then(res => dispatch(setNotification({message: "Team name saved successfully", type: 'info'})))
            .catch(err => {
                dispatch(setNotification({message: "Failed to save team name" , type: 'error'}))

                console.log(err)
            })
    }
}

export function handleSetOnCallPerson(slackId) {
    return dispatch => {
        return api.setOnCallPerson(slackId)
            .then(res => dispatch(setNotification({message: "On-Call person updated successfully", type: 'info'})))
            .catch(err => {
                if (err.response.body !== undefined && err.response.body !== null) {
                    dispatch(setNotification({message: "Failed to set on call person: " + err.response.body.errorMessage , type: 'error'}))
                } else {
                    dispatch(setNotification({message: "Failed to set on call person" , type: 'error'}))
                }

                console.log(err)
            })
    }
}

export function handleDeleteTeam() {
    return dispatch => {
        return api.deleteTeam()
            .then(res => {
                dispatch(setNotification({message: "Team deleted successfully", type: 'info'}))
                wait(3000).then(() => window.location.reload(false))
            })
            .catch(err => {
                if (err.response.body !== undefined && err.response.body !== null) {
                    dispatch(setNotification({message: "Team failed to delete: " + err.response.body.errorMessage , type: 'error'}))
                } else {
                    dispatch(setNotification({message: "Team failed to delete" , type: 'error'}))
                }

                console.log(err)
            })
    }
}


export const wait = (timeMs = 2500) => new Promise(resolve => {
    setTimeout(() => {
        resolve()
    }, timeMs)
})

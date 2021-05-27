import * as Immutable from 'immutable'
import {
    CLEAR_NOTIFICATION,
    SET_FULL_NAME,
    SET_LOADING,
    SET_NOTIFICATION,
    SET_TEAM_ID, SET_TEAM_MEMBERS, SET_TEAM_NAME, SET_TEAM_SETUP,
    SET_USER_ID
} from "./action-types";

const initialState = Immutable.Map({
    userId: undefined,
    teamId: undefined,
    userFullName: '',
    loading: false
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER_ID: return state.set('userId', action.userId)
        case SET_TEAM_ID: return state.set('teamId', action.teamId)
        case SET_FULL_NAME: return state.set('userFullName', action.fullName)
        case SET_NOTIFICATION: return state.set('notification', action.notification)
        case CLEAR_NOTIFICATION: return state.set('notification', { type: '', message: '' })
        case SET_LOADING: return state.set('loading', action.isLoading)
        default: return state
    }
}
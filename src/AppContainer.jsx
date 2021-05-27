import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {setLoading, setNotification, setTeamId, setUserFullName, setUserId} from "./action";
import {queries, queryProfile} from '@monsantoit/profile-client'
import PropTypes from "prop-types";
import NotificationContainer from "./NotificationContainer"
import {Switch, Route, withRouter} from 'react-router-dom'
import api from "./API";
import ManageTeamContainer from "./ManageTeamContainer";
import CreateTeamContainer from "./CreateTeamContainer";
import ProgressContainer from "./ProgressContainer";

export class AppContainer extends React.Component {

  componentDidMount() {

    const { setUserId, setNotification, setUserFullName, setTeamId } = this.props

    setLoading(true)

    // Load Users Entitlements
    queryProfile(queries.currentUser()).then(userProfile => {
      const userInfo = userProfile.getCurrentUser

      setUserId(userInfo.id.toLowerCase())
      setUserFullName(userInfo.preferredName.full)

      api.getTeamId().then(res => {
        setTeamId(res.body.id)

        setLoading(false)
      }).catch(error => {
        setLoading(false)
        setNotification({ type: 'error', message: 'Unable to load your info. Please contact support if the problem persists.' })
      })
    }).catch(error => {
      setLoading(false)
      setNotification({ type: 'error', message: 'Velocity API is unavailable. Please contact support if the problem persists.' })
    })

  }

  render() {

    const { teamId, setLoading, userName, userId } = this.props

    return (
      <div>
        <NotificationContainer/>
        <ProgressContainer/>
        <Switch>
          <Route exact path="/">
            <div style={{margin: '30px'}}>
              {teamId !== null && teamId !== undefined && <ManageTeamContainer/> }
              {teamId === null && teamId !== undefined && <CreateTeamContainer userName={userName} userId={userId}/>}
            </div>
          </Route>
          <Route exact path="/on-call">
            On call card goes here.
          </Route>
        </Switch>
      </div>
    )

  }
}


AppContainer.propTypes = {
  userName: PropTypes.string,
  teamId: PropTypes.number,
  userId: PropTypes.string
}

AppContainer.defaultProps = {
  userName: '',
  teamId: undefined,
  userId: undefined
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setNotification, setUserFullName, setUserId, setTeamId, setLoading
}, dispatch)

export default connect(state => ({
  userName: state.get('userFullName'),
  teamId: state.get('teamId'),
  userId: state.get('userId')
}), mapDispatchToProps)(withRouter(AppContainer))


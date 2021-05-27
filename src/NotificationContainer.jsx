import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NotificationComponent from './NotificationComponent'
import {clearNotification} from "./action";

export class NotificationContainer extends React.Component {
  render() {
    const { notification, clearNotification } = this.props

    return (
      <NotificationComponent notification={notification} onClose={clearNotification} />
    )
  }
}


NotificationContainer.propTypes = {
  clearNotification: PropTypes.func,
  notification: PropTypes.object,

}

NotificationContainer.defaultProps = {
  notification: {
    message: '',
    type: '',
  },

}

const mapDispatchToProps = dispatch => bindActionCreators({
  clearNotification
}, dispatch)

export default connect(state => ({
  notification: state.get('notification'),
}), mapDispatchToProps)(NotificationContainer)

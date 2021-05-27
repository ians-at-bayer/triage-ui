import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'
import {withStyles} from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const styles = {
  info: {
    background: '#42a5f5',
    height: '55px',
  },
  error: {
    background: '#ef5350',
    height: '55px',
  },
  success: {
    background: '#66bb6a',
    height: '55px',
  },
}


export class NotificationComponent extends React.Component {
  static getStyleByType(type, classes) {
    if (type === 'error') {
      return classes.error
    } if (type === 'success') {
      return classes.success
    }

    return classes.info
  }

  render() {
    const { notification, classes, onClose } = this.props

    const message = notification.message
    const type = notification.type
    const duration = notification.duration || 8000

    if (_.isEmpty(message)) {
      return <div />
    }

    const typeStyleSheet = NotificationComponent.getStyleByType(type, classes)

    return (
      <Snackbar
        action={[
          <IconButton
            aria-label='Close'
            color='inherit'
            key='close'
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={duration}
        ContentProps={{
          classes: {
            root: typeStyleSheet
          },
        }}
        message={message}
        onClose={onClose}
        open
      />
    )
  }
}

NotificationComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  notification: PropTypes.object,
  onClose: PropTypes.func,
}

NotificationComponent.defaultProps = {
  notification: {
    message: '',
    type: '',
  },


}

export default withStyles(styles)(NotificationComponent)

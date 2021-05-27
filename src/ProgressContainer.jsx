import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

export class ProgressContainer extends React.Component {
  render() {
    const { loading } = this.props
      
    return (
      <Dialog  maxWidth='lg' open={loading} >
        <DialogContent>
          <DialogContentText>
            <span className='velocity-spinner'/>
          </DialogContentText>
        </DialogContent>
      </Dialog>
     )
  }
}

ProgressContainer.propTypes = {
  loading: PropTypes.bool,
}

ProgressContainer.defaultProps = {
  loading: false,
}

export default connect(state => ({
  loading: state.get('loading'),
}), null)(ProgressContainer)

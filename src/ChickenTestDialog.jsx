import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

export function ChickenTestDialog({isOpen, setOpen, actionCallback, chickenTestQuestion}) {

    const handleTakeAction = () => {
        actionCallback()
        setOpen(false)
    }

    return (
        <Dialog
            open={isOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Confirm Action</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {chickenTestQuestion}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                    No
                </Button>
                <Button onClick={handleTakeAction} color="primary" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )

}
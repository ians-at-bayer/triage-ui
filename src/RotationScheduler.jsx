import React from 'react'
import {Select, TextField} from "@material-ui/core"
import PropTypes from "prop-types";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {createRotationDate} from "./Util";

export default function RotationScheduler({ selectedDate, setSelectedDate, selectedFreq, setSelectedFreq }) {

    const availableFreq = Array.from({length: 30}, (_, i) => i + 1)

    const handleSetSelectedDate = (value) => {
        const timeParts = value.split(":") //hours:minutes

        setSelectedDate(createRotationDate(timeParts[0], timeParts[1], selectedFreq))
    }

    const padTimeUnit = (timeUnit) => ('0' + timeUnit).slice(-2)
    const selectedDateValue = (selectedDate) ? padTimeUnit(selectedDate.getHours()) + ":" + padTimeUnit(selectedDate.getMinutes()) : ''

    return (
        <React.Fragment>
            Every&nbsp;
            <Select
                native
                value={selectedFreq}
                onChange={(e) => setSelectedFreq(parseInt(e.target.value))}
                inputProps={{
                    name: 'age',
                    id: 'age-native-simple',
                }}>

                {availableFreq.map(i => <option key={i} value={i}>{i}</option>)}
            </Select>
            &nbsp;days at&nbsp;
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TextField
                    id="time"
                    type="time"
                    value={selectedDateValue}
                    onChange={(e) => handleSetSelectedDate(e.target.value)}
                    style={{verticalAlign: 'middle'}}
                    InputLabelProps={{shrink: true}}
                    inputProps={{step: 300}}
                />
            </MuiPickersUtilsProvider>
                local time rotate the support person and send a message to Slack.
        </React.Fragment>
    )
}

RotationScheduler.propTypes = {
    selectedDate: PropTypes.object,
    selectedFreq: PropTypes.number,
    setSelectedDate: PropTypes.func,
    setSelectedFreq: PropTypes.func
}

RotationScheduler.defaultProps = {}

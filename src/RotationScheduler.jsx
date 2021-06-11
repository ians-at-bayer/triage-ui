import React from 'react'
import {Select, TextField} from "@material-ui/core"
import PropTypes from "prop-types";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

export default function RotationScheduler({ selectedTime, setSelectedTime, selectedDate, setSelectedDate, selectedFreq, setSelectedFreq }) {

    const availableFreq = Array.from({length: 30}, (_, i) => i + 1)

    return (
        <React.Fragment>
            Starting on&nbsp;
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TextField
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{verticalAlign: 'middle'}}
                    InputLabelProps={{shrink: true}}
                    inputProps={{step: 300}}
                />
            </MuiPickersUtilsProvider>
            &nbsp;
            and every&nbsp;
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
            &nbsp;days thereafter rotate to the next support person and send a message to Slack at approximately &nbsp;
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TextField
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    style={{verticalAlign: 'middle'}}
                    InputLabelProps={{shrink: true}}
                    inputProps={{step: 300}}
                />
            </MuiPickersUtilsProvider>
                &nbsp;local time.
        </React.Fragment>
    )
}

RotationScheduler.propTypes = {
    selectedDate: PropTypes.string,
    selectedTime: PropTypes.string,
    selectedFreq: PropTypes.number,
    setSelectedDate: PropTypes.func,
    setSelectedTime: PropTypes.func,
    setSelectedFreq: PropTypes.func
}

RotationScheduler.defaultProps = {}

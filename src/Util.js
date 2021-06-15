export const padTimeUnit = (timeUnit) => ('0' + timeUnit).slice(-2)

export function parseDateTimeStrings(rotationTime, rotationDate) {
    const time = rotationTime.split(":")
    const date = rotationDate.split("-")

    const year = parseInt(date[0])
    const month = parseInt(date[1])-1
    const day = parseInt(date[2])
    const hour = parseInt(time[0])
    const minute = parseInt(time[1])
    return {year, month, day, hour, minute};
}
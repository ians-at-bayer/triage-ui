export const createRotationDate = (hours, minutes, freq) => {
    const today = new Date()

    const nextRotation = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0)
    nextRotation.setDate(nextRotation.getDate() + freq)

    return nextRotation
}
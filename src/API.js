import request from 'superagent'
import {getAuthHeader} from '@monsantoit/profile-client'

class API {

    /**
     * Construct an API client.
     *
     * @param apiUrl API URL
     * @param timeoutResponse Wait this long for the server to start sending.
     * @param timeoutDeadline Wait this long for the file to finish loading.
     */
    constructor(apiUrl, timeoutResponse, timeoutDeadline) {
        this.timeoutReponse = timeoutResponse
        this.timeoutDeadline = timeoutDeadline
        this.url = `${apiUrl}`
    }

    //
    // GET
    //

    getTeamId() {
        return this._request('GET', `${this.url}/team/id`)
    }

    getTeamName() {
        return this._request('GET', `${this.url}/team/name`)
    }

    getTeamSetup() {
        return this._request('GET', `${this.url}/setup`)
    }

    teamsSend() {
        return this._request('GET', `${this.url}/teams-send`)
    }

    getOnCalluser() {
        return this._request('GET', `${this.url}/on-call`)
    }

    getOnCallUserForTeam(teamId) {
        return this._request('GET', `${this.url}/on-call/${teamId}`)
    }

    //
    // POST
    //

    setupTeam(teamName, nextRotationTime, rotationFrequency, hookUrl, message, teamMembers) {
        const json = `
            {
              "teamName": "${teamName}",
              "rotationConfig": {
                "nextRotationTime": "${nextRotationTime}",
                "rotationFrequencyDays": ${rotationFrequency}
              },
              "teamsConfig": {
                "hookUrl": "${hookUrl}",
                "message": "${message}"
              },
              "people": [
                ${teamMembers.map(person => this._personJson(person)).join(",")}
              ]
            }
            `

        return this._request('POST', `${this.url}/setup`)
            .send(json)
    }

    //
    // PUT
    //

    saveRotationConfig(rotationFreq, rotationDate) {
        return this._request('PUT', `${this.url}/rotation-config`)
            .send(`{ "nextRotationTime": "${rotationDate}", "rotationFrequencyDays": ${rotationFreq} }`)
    }

    saveTeamsConfig(hookUrl, message) {
        return this._request('PUT', `${this.url}/teams-config`)
            .send(`{ "hookUrl": "${hookUrl}", "message": "${message}" }`)
    }

    saveTeamMembers(teamMembers) {
        const teamJson = `[${teamMembers.map(person => this._personJson(person)).join(",")}]`

        return this._request('PUT', `${this.url}/people`).send(teamJson)
    }

    saveTeamName(teamName) {
        return this._request('PUT', `${this.url}/team/name/${teamName}`)
    }

    setOnCallPerson(userId) {
        return this._request('PUT', `${this.url}/on-call/${userId}`)
    }

    //
    //Delete
    //
    deleteTeam() {
        return this._request('DELETE', `${this.url}/team`)
    }

    //
    //Utils
    //


    _personJson(person)  {
        return `{"name": "${person.name}", "userId": "${person.userId}"}`
    }

    _request(method, url) {
        return request(method, url)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(getAuthHeader())
            .timeout({
                // Wait this long for the server to start sending.
                response: this.timeoutReponse,
                // Wait this long for the file to finish loading.
                deadline: this.timeoutDeadline,
            })

    }
}

//TODO: Remove the hardcoded URL used due to the innovation week time crunch
const api = new API(
    'https://test.velocity-np.ag/support-triage-manager-api/v1',
    60 * 1000,
    60 * 1000
)

export default api
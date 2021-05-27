import request from 'superagent'

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

    slackSend() {
        return this._request('GET', `${this.url}/slack-send`)
    }

    getOnCalluser() {
        return this._request('GET', `${this.url}/on-call`)
    }

    //
    // POST
    //

    setupTeam(teamName, nextRotationTime, rotationFrequency, slackHookUrl, slackMessage, teamMembers) {
        const json = `
            {
              "teamName": "${teamName}",
              "rotationConfig": {
                "nextRotationTime": "${nextRotationTime}",
                "rotationFrequencyDays": ${rotationFrequency}
              },
              "slackConfig": {
                "slackHookUrl": "${slackHookUrl}",
                "slackMessage": "${slackMessage}"
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

    saveSlackConfig(slackHookUrl, slackMessage) {
        return this._request('PUT', `${this.url}/slack-config`)
            .send(`{ "slackHookUrl": "${slackHookUrl}", "slackMessage": "${slackMessage}" }`)
    }

    saveTeamMembers(teamMembers) {
        const teamJson = `[${teamMembers.map(person => this._personJson(person)).join(",")}]`

        return this._request('PUT', `${this.url}/people`).send(teamJson)
    }

    saveTeamName(teamName) {
        return this._request('PUT', `${this.url}/team/name/${teamName}`)
    }

    setOnCallPerson(slackId) {
        return this._request('PUT', `${this.url}/on-call/${slackId}`)
    }

    //
    //Utils
    //


    _personJson(person)  {
        return `{"name": "${person.name}", "slackId": "${person.slackId}"}`
    }

    _request(method, url) {
        return request(method, url)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .timeout({
                // Wait this long for the server to start sending.
                response: this.timeoutReponse,
                // Wait this long for the file to finish loading.
                deadline: this.timeoutDeadline,
            })
    }
}

const api = new API(
    '/support-triage-manager-api/v1',
    60 * 1000,
    60 * 1000
)

export default api
const request = require('request');
const jsonupdate = require('update-json-file');
const settingsfile = './settings.json';
const settings = require(settingsfile);

// Gate Control API definitions
var gate = { url : "https://tolotrack.fi/api" };
gate.login = gate.url + "/login";
gate.users = gate.url + "/users";
gate.events = gate.url + "/events";
gate.accesses = gate.url + "/gateaccesses";

if(settings.tolotrack.token != "" ){
    // Get list of all users
    request.get(gate.users, {headers: {'Authorization': 'Bearer ' + settings.tolotrack.token}}, function(error, response, body){
        // TODO Should check validity of login token ie. if error then get new token.
        console.log(body)
    });
}
else{
    // Login to service and get auth token
    request.post(gate.login, {
        json: {
            'email' : settings.tolotrack.user,
            'password' : settings.tolotrack.pass,
        }},
        function(error, response, body){
            // Save auth token to settings
            gate.token = body.response.authentication_token;
            jsonupdate (settingsfile, (data) => {
                data.tolotrack.token = gate.token
                return data
            });
        }
    );
}

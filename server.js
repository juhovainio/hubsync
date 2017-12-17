const request = require('request');

// Manipulating json files
const jsonupdate = require('update-json-file');
const jsonfile = require('jsonfile');
const jsonquery = require('json-query');

// Local files
const settingsfile = './settings.json';
const userDB = './db/users.json';

const settings = require(settingsfile);
const users = require(userDB);

// Gate Control API definitions
var gate = { url : "https://tolotrack.fi/api" };
gate.login = gate.url + "/login";
gate.users = gate.url + "/users";
gate.events = gate.url + "/events";
gate.accesses = gate.url + "/gateaccesses";

// Update the auth token in settings.json
function updateToken() {
    // Login to service and get auth token
    request.post(gate.login, {
        json: {
            'email' : settings.tolotrack.user,
            'password' : settings.tolotrack.pass,
        }},
        function(error, response, body){
            // TODO Print error if it exists
            // Save auth token to settings
            gate.token = body.response.authentication_token;
            jsonupdate (settingsfile, (data) => {
                data.tolotrack.token = gate.token
                return data
            });
        }
    );
}

// Updates users.json with the latest from gate
function updateUsers() {
    // Get list of all users
    request.get({url: gate.users, json: true, 
        headers: {'Authorization': 'Bearer ' + settings.tolotrack.token}},
        function(error, response, body){
            // TODO Should check validity of login token ie. if error then get new token.
            var json = body.response;
            jsonfile.writeFile(userDB, json, {spaces: 2, EOL: '\r\n'}, function(err){
                console.error(err)
            });
        }
    );
}

function getUser(id) {
    
}

var querytest = jsonquery('[id=38574]', { data: users })

console.log(querytest.value)
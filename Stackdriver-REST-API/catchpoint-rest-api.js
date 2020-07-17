const UniRest = require('unirest')
const CatchpointApiBaseUrl = 'https://io.catchpoint.com/ui/api/'

// [START function_getToken]
/**
 * Generates "Access Token" which is required during API communications. 
 */
module.exports = {
  getToken: function (id, secret, callback) {
    let url = CatchpointApiBaseUrl + 'token';
    UniRest
      .post(url)
      .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
      .send('grant_type=client_credentials')
      .send(`client_id=${id}`)
      .send(`client_secret=${secret}`)
      .then((response) => {
        callback(response.body);
      });
  },

// [START function_getPerformanceData]
/**
 * Retrieve 15 minutes of raw performance chart data for a given testId.
 */
  getPerformanceData: function (testId, token, callback) {
    const url = CatchpointApiBaseUrl + 'v1/performance/raw?tests=' + testId;
    UniRest
      .get(url)
      .headers({
        authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
      .then((response) => {
        callback(response.body);
      });
  }
}

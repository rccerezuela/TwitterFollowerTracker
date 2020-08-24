const OAuth = require('oauth')
const got = require('got')
const { promisify } = require('util')
const firebase = require("firebase");

 // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCgduBXRzvbX-ThWP_R5t_xcxYEMPqVzjc",
    authDomain: "twitterfollowercountertracker2.firebaseapp.com",
    databaseURL: "https://twitterfollowercountertracker2.firebaseio.com",
    projectId: "twitterfollowercountertracker2",
    storageBucket: "twitterfollowercountertracker2.appspot.com",
    messagingSenderId: "978600642574",
    appId: "1:978600642574:web:e02cd7a2839e83320d945f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



getTwitterUserProfileWithOAuth2('elcorteingles')
    .then((profile) => 
      showFollowersResult(profile)
    )
    .catch(err => console.error(err) && process.exit(1))


async function getTwitterUserProfileWithOAuth2 (username = 'elcorteingles') {
  var oauth2 = new OAuth.OAuth2(
    "8AwdDjAbUCw5FtYG1YrVLvi3o",
    "pYOwSP8vWzxDP4iHsciu7twwOw8HFSEL560J4LOsxjTYnxATon",
    'https://api.twitter.com/', null, 'oauth2/token', null
  )
  const getOAuthAccessToken = promisify(oauth2.getOAuthAccessToken.bind(oauth2))
  const accessToken = await getOAuthAccessToken('', { grant_type: 'client_credentials' })

  return got(`https://api.twitter.com/1.1/users/show.json?screen_name=${username}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then((res) => JSON.parse(res.body))
}

async function showFollowersResult(result){

  const fireBaseRegister = {
    "twitter_id":  result.id,
    "followers":   result.followers_count,
    "twitter_name": "elcorteingles",
    "data_date": Date.now()
  }

  const database = firebase.database();
  let dataRef = database.ref('measures');
  let dataPush = dataRef.push(fireBaseRegister);

  dataRef.once('value', snapshot => {
  console.log(snapshot.val());
});

/*
const date =  fireBaseRegister.data_date;
const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 

console.log(`${day}-${month}-${year }`)
*/

 
}

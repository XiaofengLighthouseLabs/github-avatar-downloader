var request = require('request');

var fs = require('fs');
console.log('Welcome to the GitHub Avatar Downloader!');

// use avatar URL as input, output to  local file path

var repoOwner = process.argv[2];
var repoName = process.argv[3];

function downloadImageByURL(url, filePath) {

  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log('Response statusMessage: ', response.statusMessage);
         console.log('Response headers: ', response.headers['content-type']);
         console.log('Downloading image...');


       })
       .on('end', function (){
         console.log ('Download complete.');
       })
       .pipe(fs.createWriteStream(filePath));
}


// get list of repo contributors and call download Image By URL on each

function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  var requestOptions = {

    headers: {
      'User-Agent': 'request'
    }
  };
  // passing in avatar_url from your callback function into downloadImageByURL
  request(requestURL, requestOptions, function(err, res, body) {

    cb(err, res, body)

  });

}

function callback (err, res, body){
  if (err) {
    throw err;
  }

  var data = JSON.parse(body);
  data.forEach(function(user){
       console.log("Avatar URL for " + user.login + ": " + user.avatar_url);
       downloadImageByURL(user.avatar_url, './avatars/' + user.login + '.png');
    });
  }



getRepoContributors(repoName, repoOwner, callback);





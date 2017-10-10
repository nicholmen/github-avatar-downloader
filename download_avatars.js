//Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, avatars/.

var request = require('request');
var fs = require('fs');
console.log('Welcome to the GitHub Avatar Downloader!');
var GITHUB_USER = "nicholmen";
var GITHUB_TOKEN = "534edbe57a39e8387ca8f631b50860bdc5250a93";
var repoOwner = process.argv[2];
var repoName = process.argv[3];
var requestURL = {
  url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
  headers: {
    "User-Agent": "nicholmen"
  }
};

function getRepoContributors(url, cb) {
  var userObject = {};
  request(requestURL, function (err, res, body) {
  var data = JSON.parse(body);
    if (!fs.existsSync('./avatars/')) {
      fs.mkdir("./avatars");
    }
    data.forEach(function (entry) {
      userObject.username = entry.login;
      userObject.avatar = entry.avatar_url;
      cb(userObject);
    });
  });

}

function downloadImageByUrl(userObject) {
  request.get(userObject.avatar)
    .on('error', function (err) {
      throw err;
    })
    .pipe(fs.createWriteStream('./avatars/' + userObject.username + '.jpg'))

    .on('finish', function (end) {
      console.log('download finished');
    });
}
getRepoContributors(requestURL, downloadImageByUrl);
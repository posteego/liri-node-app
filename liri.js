require('dotenv').config();

var keys = require('./keys.js');

var command = process.argv[2];
var content;
var random = false;
const available_commands = [
  'my-tweets',
  'spotify-this-song',
  'movie-this',
  'do-what-it-says'
];

function checkCommand() {
  switch (command) {
    case available_commands[0]:
      my_tweets();
      break;
    case available_commands[1]:
      spotify_it();
      break;
    case available_commands[2]:
      omdb();
      break;
    case available_commands[3]:
      random_command();
      break;
  };
}

function my_tweets() {
  var twitter = require('twitter');
  var client = new twitter(keys.twitter);
  var params = { screen_name: 'LiriNode1', count: 20 };

  /*
  https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html
  */
  client.get('statuses/user_timeline', params, function (err, tweets) {
    if (err)
      throw err;

    console.log("                    Last 20 Tweets                    ");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("");

    for (let i = 0; i < tweets.length; i++) {
      console.log("Tweet " + (tweets.length - i) + ": " + tweets[i].text);
      console.log("Created: " + tweets[i].created_at);
      console.log("______________________________________________________");
      console.log("");
    }
  });
}


function spotify_it() {
  // https://developer.spotify.com/dashboard/applications
  var song;

  if (random === true) {
    song = content[1];
  } else {
    song = getSearchQuery();
  }

  if (song === 'spotify-this-song' || song === undefined || song === '\n')
    song = "The Sign by Ace of Base";

  console.log('Searching For: ' + song);

  var spotify = require('node-spotify-api');
  var client = new spotify(keys.spotify);

  var search = { type: 'track', query: song };

  client.search(search, function (err, data) {
    if (err)
      throw err;

    console.log("");
    console.log("       Artist: " + data.tracks.items[0].artists[0].name);
    console.log("    Song name: " + data.tracks.items[0].name);
    console.log(" External url: " + data.tracks.items[0].external_urls.spotify);
    console.log("        Album: " + data.tracks.items[0].album.name);
    console.log("");
  });
}

function getSearchQuery() {
  var search = '';
  for (let i = 3; i < process.argv.length - 1; i++) {
    search += process.argv[i] + ' ';
  }
  search += process.argv[process.argv.length - 1];
  return search;
}


function omdb() {
  var movie;
  if (random === true) {
    movie = content[1];
  } else {
    movie = getSearchQuery();
  }

  if (movie === 'movie-this' || movie === undefined || movie === '\n')
    movie = 'Mr. Nobody';

  console.log("Searching for: " + movie);
  var request = require('request');

  var url = 'http://www.omdbapi.com/?t=' + movie + '&apikey=trilogy';

  request(url, function (err, stuff, data) {
    if (err)
      throw err;
    
    data = JSON.parse(data);

    console.log("");
    console.log("                 Title: " + data.Title);
    console.log("                  Year: " + data.Year);
    console.log("           IMDB Rating: " + data.imdbRating + " / 10");
    console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
    console.log("               Country: " + data.Country);
    console.log("              Language: " + data.Language);
    console.log("");
    console.log("Actors: " + data.Actors);
    console.log("");
    console.log("Plot: " + data.Plot);
    console.log("");
  });
}


function random_command() {
  random = true;
  var fs = require('fs');
  fs.readFile('random.txt', 'utf-8', function (err, data) {
    if (err)
      throw err;
    content = data.split(',');
    command = content[0];
    checkCommand();
  });
}

checkCommand();
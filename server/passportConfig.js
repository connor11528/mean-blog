
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;
var creds = require('./credentials');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new SpotifyStrategy({
    clientID: creds['spotify_client_id'],
    clientSecret: creds['spotify_client_secret'],
    callbackURL: "http://localhost:3000/api/spotify/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null, profile);
  }
));
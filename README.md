# TwitSocks
Simple webapp using Node + WebSockets + Angular + MongoDB

# Demo
http://twitsocks.herokuapp.com/

# Running Locally
Make sure you have Node and MongoDB installed
You'll need to register a twitter app at dev.twitter.com, use the
consumer_key, consumer_secret, access_token, and access_token_secret
keys to populate respective fields in server.js

``` bash
npm install
foreman start
```

# Running on Heroku

``` bash
heroku create
heroku labs:enable websockets
git push heroku master
heroku open
```

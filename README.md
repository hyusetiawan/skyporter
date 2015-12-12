# Skyporter
Skyporter is an exporter tool from Skype's sqlite3  main.db. Skype puts all of its client data such as messages, contacts, videos, etc, 
and some of them are not easily accessible, a glaring example is getting the video messages that were sent to you. 

## Getting Started
The app is written using [riot](http://riotjs.com/), why do you ask? Cause it looks nifty. To run the app locally, do the following
`npm install -g riot` and run ./watch.sh which will translate .jsx to .js and of course, run `python -m SimpleHTTPServer`
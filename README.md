# yaml-env

A library used to load a yaml file and layer ENV variables over it automatically.

## Usage

Right now, this is just meant to load a config file from within a Node app.

```javascript
// config-loader.js
const yaml_env = require('yaml-env');
var config = yaml_env.load('TURTL', './config/config.yaml');
console.log(JSON.stringify(config, null, 2));
```

This loads the file `./config/config.yaml`, and checks each key in the resulting
object for a match in the ENV (using the prefix `TURTL_`). For instance, if our
config file looks like this:

```yaml
---
server:
  port: 8181

db:
  host: '127.0.0.1'
  port: 5432
  database: 'turtl_db'
  user: 'LOGIN'
  password: 'PASSWORD'
  pool: 24

larry:
  phrases:
    - and we all, parker, have, parker, a report due...parker.
    - outdoor outdoor.
    - ah ah! alright, parker. shutup. thank you.
    - nobody thinks you're funny.
    - alex, remember what we talked about.

loglevel: 'info'
```

We can override bits of this config using env vars.

```bash
$ node config-loader.js
{
  "server": {
    "port": 8181
  },
  "db": {
    "host": "127.0.0.1",
    "port": 5432,
    "database": "turtl_db",
    "user": "LOGIN",
    "password": "PASSWORD",
    "pool": 24
  },
  "larry": {
    "phrases": [
      "and we all, parker, have, parker, a report due...parker.",
      "outdoor outdoor.",
      "ah ah! alright, parker. shutup. thank you.",
      "nobody thinks you're funny.",
      "alex, remember what we talked about."
    ]
  },
  "loglevel": "info"
}

$ export TURTL_SERVER_PORT=6969
$ export TURTL_DB_USER="larry"
$ export TURTL_DB_PASSWORD="passw0rd"
$ export TURTL_LARRY_PHRASES_1="i think i'm talking."
$ node config-loader.js
{
  "server": {
    "port": "6969"
  },
  "db": {
    "host": "127.0.0.1",
    "port": 5432,
    "database": "turtl_db",
    "user": "larry",
    "password": "passw0rd",
    "pool": 24
  },
  "larry": {
    "phrases": [
      "and we all, parker, have, parker, a report due...parker.",
      "i think i'm talking.",
      "ah ah! alright, parker. shutup. thank you.",
      "nobody thinks you're funny.",
      "alex, remember what we talked about."
    ]
  },
  "loglevel": "info"
}
```

Arrays can be a bit tricky since you might want to add more elements than exist
in the default config. In this case, you can replace te entire array by giving
it a JSON string:

```bash
$ export TURTL_LARRY_PHRASES='["alright. next to me. for the rest of the walk. lets go.", "sko!"]'
$ node config-loader.js
{
  "server": {
    "port": 8181
  },
  "db": {
    "host": "127.0.0.1",
    "port": 5432,
    "database": "turtl_db",
    "user": "LOGIN",
    "password": "PASSWORD",
    "pool": 24
  },
  "larry": {
    "phrases": [
      "alright. next to me. for the rest of the walk. lets go.",
      "sko!"
    ]
  },
  "loglevel": "info"
}
```


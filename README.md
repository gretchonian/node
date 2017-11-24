

This app was built using: node  -v 8.9.1
                          mysql -v 5.7.2
See package.json for all other dependencies.

##GET STARTED

Clone from GitHub

then

    npm install

##Mysql Configuration

server.js

    host: 'localhost',
    user: 'mysqluser',
    password: 'password',
    database: 'rvtd'

##DB Configuration

database config to mysql has same connection parameters as server.js

create db 'rvtd'

    node createdb.js

create table 'users'

    node createtable.js



##Start 'rvtd'

    node .

##Open your browser

    http://127.0.0.1:3000/users


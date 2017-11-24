

This node.js app was built using: node  -v 8.9.1,
                          mysql -v 5.7.2.
See package.json for all other dependencies.

##GET STARTED

clone or download, cd into folder.

    npm install

##MYSQL CONFIG

server.js

    host: 'localhost',
    user: 'mysqluser',
    password: 'password',
    database: 'rvtd'

##DB CONFIG

database configuration to mysql has the same connection parameters as those in server.js

create db 'rvtd':

    node createdb.js

create table 'users':

    node createtable.js


##START APP

in your console:

    node .

open your browser to:

    http://127.0.0.1:3000/users


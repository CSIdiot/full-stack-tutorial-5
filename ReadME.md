# Project Set Up
nvm install 10  

nvm alias default 10  

node --version  

npm --version  

npm install -g npm@6  

npm init  

npm install express  

npm uninstall express  

npm install express@4  



# JSX Transferform
npm install --save-dev @babel/core@7 @babel/cli@7  

node_modules/.bin/babel --version  

npx babel --version  

npm install --save-dev @babel/preset-react@7  

npx babel src --presets @babel/react --out-dir public

# About API
npm install graphql@0 apollo-server-express@2  

curl "http://localhost:3000/graphql?query=query+\{+about+\}"


# Mongo
npm install mongodb@3  

mongod (To start up mongo server)  

mongo customers --eval "db.customers.remove({})" (clear the memory)  

node scripts/trymongo.js (check the test)

# Schema Initialization
mongo customers scripts/init.mongo.js

# Automate
npm install nodemon@1

# start the web
npm start(open in browser)

# To see the web application
click into http://localhost:3000

# To see the playground 
click into http://localhost:3000/graphql

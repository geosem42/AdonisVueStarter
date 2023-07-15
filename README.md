# Introduction
The appliation starter kit features the following:
* Login
* Register
* Profile Settings: change name, email, password and delete account
* Email Verification

It is built using `AdonisJS`, `Vue.js`, `MySQL` with an `api` approach. 

It is designed using `Bootstrap 5`.

The starter kit provides the perfect starting point for your next project.

# Installation
Navigate to the root of your project and run
```
npm install
```
The frontend using Vue.js is located inside the `client` directory. Navigate to `/client` and run
```
npm install
```
Migrate the database (from AdonisJS root)
```
node ace migration:run
```
Run the servers
```
## From adonisjs directory
node ace serve --watch

## From client directory
npm run dev 
```
Add the following variables to you `.env` file
```
APP_URL=http://localhost:5173
SENDGRID_API_KEY=
SENDFROM_EMAIL="email@yoursite.com"
```

# Screenshots

![Login](https://i.imgur.com/OC4RDBJ.png)

![Register](https://i.imgur.com/9dfjcM6.png)

![Profile Settings](https://i.imgur.com/NqYI1U7.png)

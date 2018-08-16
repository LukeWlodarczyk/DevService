# DevService

Site is published at https://dev-service.herokuapp.com

## Technologies

- Express
- Mongoose
- Passport
- JsonWebToken
- SendGrid
- Gravatar
- React
- Redux

### Installation

Install the dependencies

```sh
$ npm run install-all
```

Run app

```sh
$ npm run dev
```

You will need to create a dev.js in the server config folder with

```
module.exports = {
	mongoURI: 'YOUR_MONGO_URI',
	sendGridKey: 'YOUR_SENDGRID_KEY',
	redirectDomain: 'YOUR_REDIRECT_DOMAIN', // e.g. http://localhost:3000
};
```

and env.development in client folder with 

```
REACT_APP_GITHUB_ID=YOUR_GITHUB_ID
REACT_APP_GITHUB_SECRET=YOUR_GITHUB_SECRET
```
# redis-social-network

This project is initially generated by Yeoman Generator using the package [express-generator](https://github.com/expressjs/generator).

## Getting Started

These instructions below will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Your Redis Database must be running.
This program will request on Local Redis on default port.
You need to have [Node.js](https://nodejs.org/en/) installed with a package manager like [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

You can check it up by running this command in your console :

```
node -v
```

### Installing

To install all the packages needed by this project, you have to run an packager manager.

Run this command if you are using [NPM](https://www.npmjs.com/):

```
npm install
```

Or this command if you are using [Yarn](https://yarnpkg.com/):

```
yarn install
```

## Running locally the code.

To run this servers locally please use this command:

```
npm start
```

The server will be running on port 8080.

<!-- ## Deployment -->

## Some API endpoint examples

* <code>GET</code> /user/:uid

    This endpoint will informations on user with uid as UID.
***
* <code>PUT</code> /createUser/user2?name=Shengda&age=25&gender=M&email=test@test.com&location=Paris

    This endpoint will create a new user with user2 as UID.
***
<!-- * <code>GET</code> /stock/distinct?key=description.Country

    This endpoint will return a list of name of distinct countries of all collections.
***
* <code>GET</code> /stock/findRegex?Company=Apple

    Return a list of company with "apple" in their Company key.
***
* <code>GET</code> /stock/aggregateChange?description.Country=France

    Return average, min and max of 24h Change of Country France.
***
* <code>GET</code> /stock/aggregateAvgVolume?description.Country=France

    Return average, min and max of 24h volume of Country France. -->


<!-- Same for aggregateROI, aggregate20Days, aggregate200Days. -->

<!-- ## Contributing -->

<!-- ## Versioning -->

## Authors

* **Shengda Liu** - *Initial work* - [shengdaliu](https://github.com/shengdaliu)
* **Prenom Nom** - *Complementary works* - [name](https://github.com/name)
* **Prenom Nom** - *Complementary works* - [name](https://github.com/name)
* **Prenom Nom** - *Complementary works* - [name](https://github.com/name)
* **Prenom Nom** - *Complementary works* - [name](https://github.com/name)

See also the list of [contributors]() who participated in this project.

## License

This project is not licenced.

<!-- ## Acknowledgments -->

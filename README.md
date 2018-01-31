# reddit-graphql

A [GraphQL](http://graphql.org/) wrapper of the [official Reddit API](https://www.reddit.com/dev/api/)

[![Build Status](https://travis-ci.org/rgilbert1/reddit-graphql.svg?branch=master)](https://travis-ci.org/rgilbert1/reddit-graphql)
[![Coverage Status](https://coveralls.io/repos/github/rgilbert1/reddit-graphql/badge.svg?branch=master)](https://coveralls.io/github/rgilbert1/reddit-graphql?branch=master)

## Getting Started

reddit-graphql is still in its infancy and is being actively developed.

To start the server from source, first install dependencies:

```sh
npm install .
```

then start the server:

```sh
npm start
```

then navigate to http://localhost:8080/graphql.

**Note:** Reddit API requires OAuth2, so in order for the GraphQL server to run
properly, an environment variable named `REDDIT_TOKEN` with a valid token must
exist. For information on how to generate a token visit
https://github.com/reddit-archive/reddit/wiki/OAuth2.
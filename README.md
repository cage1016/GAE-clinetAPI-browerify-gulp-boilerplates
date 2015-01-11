google-api-python-client
========================

Download

[google-api-python-client-gae-1.2.zip](https://code.google.com/p/google-api-python-client/downloads/detail?name=google-api-python-client-gae-1.2.zip&can=2&q=)

```
$ wget https://google-api-python-client.googlecode.com/files/google-api-python-client-gae-1.2.zip
```


TODC Bootstrap
=======================

Download

[TODC Bootstrap](http://todc.github.io/todc-bootstrap/)

```
$ wget https://github.com/todc/todc-bootstrap/releases/download/v3.3.1-3.3.1/todc-bootstrap-3.3.1-3.3.1-dist.zip
```

browerify + gulp
=======================

## literalify

[pluma/literalify](https://github.com/pluma/literalify)

## Description

- [Browserify - Bring Nodejs modules to browsers](http://truongtx.me/2014/03/20/browserify-bring-nodejs-modules-to-browser)

If the libraries you want to browserify are designed for client-side environment (browsers), do not try to find them on npm and then browserify them to the client. Because for many libraries like jquery, jquery-ui, twitter bootstrap, they relies on global object to work properly. The solution is just load those libraries through the script tag like the traditional way that we used to do (can also be installed with a package manager like bower) and use browserify with literalify transform to pretend those libraries are actual CommonJS modules.


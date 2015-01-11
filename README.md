# Getting Started

#### 1. Install gulp, browserify globally:

```sh
$ npm install --global gulp
$ npm install --global browserify
```

#### 2. Clone repo from github:

```sh
$ git clone https://github.com/cage1016/GAE-clinetAPI-browerify-gulp-boilerplates.git
```

#### 2. Install proejct module from package.json, bower file:

```sh
$ npm install
$ bower install
```

#### 4. Install Google API Python client

```sh
$ wget https://google-api-python-client.googlecode.com/files/google-api-python-client-gae-1.2.zip
$ unzip google-api-python-client-gae-1.2.zip
```

#### 4. Run gulp:

```sh
$ gulp build
```

#### 5. Check result

```sh
$ dev_appserver.py .
```

#### 6. modify application

go `app.yaml` to modify your `your-application-id`

#### 7. Add WEB_CLIENT_ID, WEB_CLIENT_ID_SECRET, DEVELOPER_KEY

go `lib/config.py` to modify your `WEB_CLIENT_ID`, `WEB_CLIENT_ID_SECRET` and `DEVELOPER_KEY` as you need.
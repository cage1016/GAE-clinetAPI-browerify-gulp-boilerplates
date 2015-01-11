__author__ = 'cage'

from oauth2client.appengine import OAuth2Decorator

# miwatermarker project
WEB_CLIENT_ID = '449185255153-s516l7g99ssjuc5sv6eg81j52d8aid7u.apps.googleusercontent.com'
WEB_CLIENT_ID_SECRET = '31vrbHuWh5d7YwIBFjWYKZnY'

DEVELOPER_KEY = 'AIzaSyBZtDEOMCVfKtmlE_7YEvkrzEO4Qxklg3I';

API_SCOPE = ['https://www.googleapis.com/auth/userinfo.email',
             'https://www.googleapis.com/auth/plus.login',
             'https://www.googleapis.com/auth/drive.file',
             'https://www.googleapis.com/auth/drive']

decorator = OAuth2Decorator(client_id=WEB_CLIENT_ID,
                            client_secret=WEB_CLIENT_ID_SECRET,
                            scope=API_SCOPE)
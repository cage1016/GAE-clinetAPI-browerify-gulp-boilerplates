__author__ = 'cage'

from oauth2client.appengine import OAuth2Decorator

WEB_CLIENT_ID = 'your-web-client_id'
WEB_CLIENT_ID_SECRET = 'you-web-client-secret'

DEVELOPER_KEY = 'your-developer-key'

API_SCOPE = ['https://www.googleapis.com/auth/userinfo.email',
             'https://www.googleapis.com/auth/plus.login',
             'https://www.googleapis.com/auth/drive.file',
             'https://www.googleapis.com/auth/drive']

decorator = OAuth2Decorator(client_id=WEB_CLIENT_ID,
                            client_secret=WEB_CLIENT_ID_SECRET,
                            scope=API_SCOPE)
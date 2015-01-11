#!/usr/bin/env python

import webapp2

from lib.controllers.base import RevokeTokenHandler, BaseHandler
from lib.config import decorator


class MainHandler(BaseHandler):
  def get(self):
    params = {}
    self.render('index.html', **params)


routes = [
  ('/', MainHandler),
  ('/revoke_token', RevokeTokenHandler),
  (decorator.callback_path, decorator.callback_handler())
]

router = webapp2.WSGIApplication(routes, debug=True)
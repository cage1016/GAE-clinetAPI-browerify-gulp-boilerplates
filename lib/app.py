#!/usr/bin/env python

import webapp2

from lib.controllers.base import RevokeTokenHandler, BaseHandler
from lib.controllers.about_handler import AboutHandler
from lib.controllers.react_handler import ReactHandler
from lib.controllers.spa_handler import SPAHandler
from lib.config import decorator


class MainHandler(BaseHandler):
  def get(self):
    params = {}
    self.render('index.html', **params)


routes = [
  ('/', MainHandler),
  ('/about', AboutHandler),
  ('/react', ReactHandler),
  ('/spa', SPAHandler),
  ('/revoke_token', RevokeTokenHandler),
  (decorator.callback_path, decorator.callback_handler())
]

router = webapp2.WSGIApplication(routes, debug=True)
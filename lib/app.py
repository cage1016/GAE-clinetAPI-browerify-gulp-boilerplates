#!/usr/bin/env python

import webapp2


class MainHandler(webapp2.RequestHandler):
  def get(self):
    self.response.write('Hello world!')


routes = [
  ('/', MainHandler)
]

router = webapp2.WSGIApplication(routes, debug=True)
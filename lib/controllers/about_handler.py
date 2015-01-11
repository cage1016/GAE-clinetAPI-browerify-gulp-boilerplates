__author__ = 'cage'

from lib.controllers.base import BaseHandler


class AboutHandler(BaseHandler):
  def get(self):
    params = {}
    self.render('about.html', **params)
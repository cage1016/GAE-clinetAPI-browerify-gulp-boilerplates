__author__ = 'cage'

from lib.controllers.base import BaseHandler


class SPAHandler(BaseHandler):
  def get(self):
    params = {}
    self.render('spa.html', **{})

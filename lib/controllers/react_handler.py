__author__ = 'cage'

from lib.controllers.base import BaseHandler


class ReactHandler(BaseHandler):
  def get(self):
    params = {}
    self.render('react.html', **{})

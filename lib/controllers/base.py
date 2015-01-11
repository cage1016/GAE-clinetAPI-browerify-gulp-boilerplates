# -*- encoding: utf-8 -*-

import webapp2
import jinja2
from jinja2.runtime import TemplateNotFound

from google.appengine.api import users
from google.appengine.api import urlfetch

import lib.config as config
from lib.config import decorator

JINJA_ENVIRONMENT = jinja2.Environment(
  loader=jinja2.FileSystemLoader('templates'),
  extensions=['jinja2.ext.autoescape'],
  autoescape=True)


class BaseHandler(webapp2.RequestHandler):
  @webapp2.cached_property
  def credentials(self):
    return decorator.credentials

  @webapp2.cached_property
  def user(self):
    return users.get_current_user()

  @webapp2.cached_property
  def jinja2(self):
    # Returns a Jinja2 renderer cached in the app registry.
    return jinja2.get_jinja2(app=self.app)

  def render(self, _template, **context):

    values = {
      'WEB_CLIENT_ID': config.WEB_CLIENT_ID,
      'DEVELOPER_KEY': config.DEVELOPER_KEY,
      'login_url': users.create_login_url('/'),
      'logout_url': users.create_logout_url('/'),
      'credentials': self.credentials,
      'user': self.user
    }

    # Add manually supplied template values
    values.update(context)

    # read the template or 404.html
    try:
      template = JINJA_ENVIRONMENT.get_template(_template)
      self.response.write(template.render(**values))
    except TemplateNotFound:
      self.abort(404)


class RevokeTokenHandler(webapp2.RequestHandler):
  @decorator.oauth_aware
  def get(self):
    if decorator.has_credentials():
      access_token = decorator.credentials.access_token
      url = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token
      urlfetch.fetch(url)
    self.redirect('/')
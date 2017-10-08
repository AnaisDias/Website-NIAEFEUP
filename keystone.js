// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
    'name': 'NIAEFEUP',
    'brand': 'NIAEFEUP',
    'sass': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': 'pug',
    'view cache': true,
    'emails': 'templates/emails',
    'signin logo': ['../../images/play-btn.png'],
    'signin redirect': '/',
    'signout redirect': '/',
    'signin url': '/signin',
    'signout url': '/',
    'auto update': true,
    'session': true,
    'session store': 'mongo',
    'auth': true,
    'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
    _: require('lodash'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
    users: 'users',
});


keystone.start();

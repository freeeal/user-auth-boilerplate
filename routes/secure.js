// ROUTER THAT HANDLES ALL SECURE PAGES, WHERE USER IS AUTHENTICATED
var User = require('../models/user');
var config = require('../config/config');

module.exports = function(router, passport){
    // make sure a user is logged in
    router.use(function(req, res, next) {
        // if user is authenticated in the session, call the next() to call the next request handler; Passport adds this method to request object. 
        if (req.isAuthenticated())
            return next();
        // if the user is not authenticated then redirect them to the auth/login page
        res.redirect('/auth');
    });

    // PROFILE SECTION =========================
    // all param callbacks are called before any handler of any route in which the param occurs, and they will be called only once in a req-resp cycle
    router.param('username', function (req, res, next, username) {
        // perform database query from User model and returns user as a reqeust object w/ username when done'
        User.findOne({ 'local.username' : username }, function(err, user) {

            if (err) {
                return next(err);
            } else if (user) {
                req.user = user;
                // console.log('user found with username:', username);
                // console.log(user);
                return next();
            } else {
                console.log('failed to load user');
                res.end();
            }
        });

    });

    // route with parameters (/users/:username)
    router.get('/users/:username', function(req, res) {
        // console.log("this is the user obj: " + req.user);
        // return res.json(req.user);
        return res.render('profile', { user : req.user }); // get the user out of session and pass to template
    });

    // catch-all route, redirects all invalid paths to the profile
    router.get('/*', function(req, res) {
        res.redirect('/users/' + req.user.local.username);
    });

}
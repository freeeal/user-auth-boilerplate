// ROUTER THAT HANDLES ALL AUTHENTICATION PAGES

// define routes for application in this module which takes the instance of Passport created in app.js
module.exports = function(router, passport, db){

    // show the home page (will also have our login links)
    // localhost:3000/auth/
    router.get('/', function(req, res) {
		res.render('index', { user: req.user });
	});

// =============================================================================
// AUTHENTICATICATION (FOR FIRST LOGIN) ========================================
// =============================================================================

  	// locally --------------------------------
        // LOGIN ===============================
        // render the login form
        // localhost:3000/auth/login
		router.get('/login', function(req, res) {
			res.render('login', { message: req.flash('loginMessage'),
								  user: req.user });
			console.log(req.flash('loginMessage'));
		});
		// handle login POST
		router.post('/login', passport.authenticate('local-login', { // this is the static authenticate method of model in LocalStrategy, used as middleware to authenticate the request
			successRedirect: '/', 
			failureRedirect: '/auth/login',
			failureFlash : true  
		}));

		// REGISTER =================================
		// render the signup form
		// localhost:3000/auth/register
		router.get('/register', function(req, res){
			res.render('register', { message: req.flash('signupMessage'),
									 user: req.user });
			console.log(req.flash('signupMessage'));
		});
		// handle signup POST
		router.post('/register', passport.authenticate('local-signup', {
			successRedirect: '/',
			failureRedirect: '/auth/register',
			failureFlash : true 
		}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// HANDLE LOGOUT ==============================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}
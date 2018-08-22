const User = require('../models').User
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
var bCrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');



module.exports = (passport, user)=> { 
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

// used to deserialize the user
    passport.deserializeUser((id, done)=> {
        User.findById(id).then((user)=> {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });

    });


    passport.use('local-signup', new LocalStrategy({
            
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        (req, email, password, done)=> {

            // asynchronous
            // User.findOne wont fire unless data is sent back

            var generateHash = (password)=>{
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            }


            
            process.nextTick(()=> {
                
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists

               
                User.findOne({
                    where: {
                      email:email
                    }
                }).then(function(user) {
                    if(!user) {
                        
                        // if there is no user with that email
                        // create the user
                        let userPassword = generateHash(password);
                        const data =
                        {
                            email:email,
                            password:userPassword
                        }
                        User.create(data).then((newUser,created)=>{
                            if(!newUser){
                                return done(null,false)
                            }
                            if(newUser){
                                let token = jwt.sign({id:newUser.id},'server secret');
                                return done(null,false,req.flash('session',token))
                            }
                        });
                    }else {
                        return done(null, false, req.flash('error', 'user already exists'))
                    }
                })

            


            });

        }));


        //login stategy
        passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback:true
        },
        (req,email,password,done)=>{
            // find a user with the email provided
            User.findOne({
                where: {
                    email: email
                }
            }).then((user)=>{
            // if there are any errors, return the error before anything else
            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('error', 'User does not exist')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            let isValidPassword = (userpass,password)=>{
                return bCrypt.compareSync(password, userpass);
            }
            if (isValidPassword(user.password,password))
                return done(null, false, req.flash('error', 'Invalid Password')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            let token = jwt.sign({id:user.id},'server secret');

            return done(null, false,req.flash('sesion',token));
            }).catch((err)=>{
                console.log("Error:",err)
                return done(null, false, {message: 'Something went wrong with your Signin'});
            })
        } ));

};

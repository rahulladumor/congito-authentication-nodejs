const express = require('express')
const router = express.Router()
const { Login, createCognitoUser,LogOut,hello,getUser} = require('./cognitoFunction');
const passport = require('passport')
const auth = require('./auth/jwtAuth')


router.post('/login',Login);
router.post('/register',createCognitoUser);
router.post('/logout',LogOut)
router.post('/hello',auth.Validate,hello)
router.get('/getuser',auth.Validate,getUser)



module.exports = router
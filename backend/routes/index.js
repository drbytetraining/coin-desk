const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout',auth,  authController.logout);
router.get('/refresh',auth,  authController.logout);


// post/ blog

// // create 
// router.post('/blog', auth)

// // get all
// router.get('/blog/all', auth)

// // get specific
// router.get('/blog/:id', auth)

// // update blog
// router.put('/blog/:id', auth)

// // delete
// router.delete('/blog/:id', auth)


// base64 
// then store into db 



// comments
//create
router.post('/comment', commentController.create);

router.get('/comment/:id', commentController.getById)

module.exports =router
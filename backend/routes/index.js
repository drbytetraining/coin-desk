const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');
const blogController = require('../controllers/blogController');

// authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout',auth,  authController.logout);
router.get('/refresh',auth,  authController.logout);


// post/ blog

// create 
router.post('/blog', auth, blogController.create)

// get all
router.get('/blog/all', auth, blogController.getAll)

// get specific
router.get('/blog/:id', auth, blogController.getById)

// update blog
router.put('/blog/:id', auth, blogController.update)

// delete
router.delete('/blog/:id', auth, blogController.delete)


// base64 
// then store into db 



// comments
//create
router.post('/comment', commentController.create);

router.get('/comment/:id', commentController.getById)

module.exports =router
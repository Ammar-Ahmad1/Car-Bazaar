const {registerUser,getUsers, login,updateUser} = require('../controllers/UserController');
const upload = require('../Middlewares/multer')
const router = require('express').Router();

router.post('/sign-up' , registerUser);
// router.put('/update-user/:id', updateUser);
// router.get('/get-user/:id', getUserById);
router.post('/sign-in', login);
router.get('/get-users', getUsers);
router.put('/update-user/:id', updateUser);
module.exports = router;
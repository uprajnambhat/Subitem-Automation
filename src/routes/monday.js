const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

router.post('/monday/update_subitems', authenticationMiddleware, mondayController.updateSubitems);

module.exports = router;

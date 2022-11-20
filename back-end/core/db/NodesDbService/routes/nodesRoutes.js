const { Router } = require('express');
const nodeController = require('../controllers/nodeController');

const router = Router();

router.post('/create-node', nodeController.create_node);

module.exports = router;
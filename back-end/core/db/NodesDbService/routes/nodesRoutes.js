const { Router } = require('express');
const nodeController = require('../controllers/nodeController');

const router = Router();

router.post('/create-node', nodeController.create_node);
router.post('/populate-node', nodeController.populate_node)
router.post('/get-user-nodes',nodeController.get_user_nodes);
router.get('/get-node/*', nodeController.get_node);

module.exports = router;
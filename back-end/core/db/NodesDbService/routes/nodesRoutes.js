const { Router } = require('express');
const nodeController = require('../controllers/nodeController');

const router = Router();

router.get('/node/:id', nodeController.get_node);
router.get('/node', nodeController.all_nodes);
router.post('/node', nodeController.create_node);
router.delete('/node/:id', nodeController.delete);

router.post('/populate-node', nodeController.populate_node)
router.post('/get-user-nodes',nodeController.get_user_nodes);
router.post('/push-stats', nodeController.push_stats)
router.post('/push_tests', nodeController.push_tests)

module.exports = router;
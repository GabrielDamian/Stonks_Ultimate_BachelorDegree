const { Router } = require('express');
const nodeController = require('../controllers/nodeController');

const router = Router();

router.post('/create-node', nodeController.create_node);
router.post('/populate-node', nodeController.populate_node)
router.post('/get-user-nodes',nodeController.get_user_nodes);
router.post('/push-stats', nodeController.push_stats)
router.post('/push_tests', nodeController.push_tests)
router.get('/get-node/*', nodeController.get_node);
router.post('/delete', nodeController.delete);
router.get('/all-nodes', nodeController.all_nodes);

module.exports = router;
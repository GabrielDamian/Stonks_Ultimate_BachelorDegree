const { Router } = require('express');
const nodeController = require('../controllers/nodeController');

const router = Router();

router.post('/layer', nodeController.create_layer);
router.get('/layer', nodeController.get_layers);
router.delete('/layer/:id', nodeController.delete_layer)

module.exports = router;
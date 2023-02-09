const { Router } = require('express');
const nodeController = require('../controllers/nodeController');

const router = Router();

router.post('/create-layer', nodeController.create_layer);
router.get('/get-layers', nodeController.get_layers);
module.exports = router;
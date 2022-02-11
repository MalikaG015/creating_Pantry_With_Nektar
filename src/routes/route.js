const express = require('express');

const router = express.Router();

const pantryController = require('../controllers/pantryController');
const basketController = require('../controllers/basketController');

//const authorAuth = require('../middlewares/authorAuth')


// Author routes
router.post('/pantry', pantryController.createPantry);
router.get('/pantry/:pantryId', pantryController.getPantry);
router.post('/pantry/:pantryId/basket/:basketName', basketController.createBasket);
router.put('/pantry/:pantryId/basket/:basketName', basketController.updateBasket);
router.get('/pantry/:pantryId/basket/:basketName', basketController.getBasket);
router.delete('/pantry/:pantryId/basket/:basketName', basketController.deleteBasket);



module.exports = router;
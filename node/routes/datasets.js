const express = require("express");
const dataController = require("../controllers/dataset")




const router = express.Router();


/**
 * get api/data/datasets
 * sends datasets for regression models to client
 */
router.get("/datasets", dataController.dataSet);

router.get("/datasetswrite", dataController.dataSetWrite);


module.exports = router;

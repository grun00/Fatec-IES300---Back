const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yamlReader = require('yamljs');

const swaggerDocs = yamlReader.load(path.resolve(path.dirname(__filename),'../common/config/swagger.yaml'));

const router = express.Router();

// define routes
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocs));

module.exports = router;
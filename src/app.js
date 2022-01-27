const express = require('express');
const cors = require('cors');

const { NODE_ENV } = process.env;
const app = express();

const database = require('./config/database');
const routes = require('./routes');
const HandleErrors = require('./middlewares/HandleErrors');
const NotFound = require('./middlewares/NotFound');

database.setup();

app.use(cors());
app.use(express.json());

if (NODE_ENV === 'development') {
  const postmanToSwagger = require('postman-2-swagger');
  const swaggerUi = require('swagger-ui-express');
  const mockCollection = require('../doecom-api.postman_collection.json'); // danger

  app.get('/swagger', swaggerUi.setup(postmanToSwagger.default(mockCollection)));
  app.use('/', swaggerUi.serve);
}

routes(app);
app.use(NotFound);
app.use(HandleErrors);

module.exports = app;

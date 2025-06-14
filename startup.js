const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const homeController = require('./controllers/disasterdetails');
function configureApp(app) {
  // JSON middleware
  app.use(express.json());

  // Swagger setup
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'My Express API',
        version: '1.0.0',
        description: 'A simple Express API documented with Swagger',
      },
      servers: [
        { url: 'http://localhost:3000' },
      ],
    },
apis: ['./controllers/*.js'], 
 };

  const swaggerSpec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Register controllers
app.use('/', homeController);
}

module.exports = configureApp; 
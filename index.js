const express = require('express');
const configureApp = require('./startup');
const cors = require('cors');
const app = express();
app.use(cors()); 

configureApp(app);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Swagger Docs at http://localhost:3000/api-docs');
});
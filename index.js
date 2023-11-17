const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./auth'); // Import auth routes
const authenticateToken = require('./middleware'); // Import JWT middleware
require('dotenv').config(); // to load the .env file

const app = express();
const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/graphql-test';
mongoose.connect( mongodb_url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/auth', authRoutes);



app.use('/graphql', authenticateToken ,graphqlHTTP({
    schema,
    graphiql: true,
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

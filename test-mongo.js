const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path as necessary
require('dotenv').config();
const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/graphql-test';
mongoose.connect(mongodb_url)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));


async function addUser(name, email, password) {
    const user = new User({ name, email, password });
    await user.save();
    console.log('User added:', user);
    return user;
}

async function updateUser(userId, newDetails) {
    const updatedUser = await User.findByIdAndUpdate(userId, newDetails, { new: true });
    console.log('User updated:', updatedUser);
    return updateUser;
}


async function deleteUser(userId) {
    await User.findByIdAndDelete(userId);
    console.log('User deleted:', userId);
}

// Testing
async function testUserOperations() {
    try {
        const newUser = await addUser('John Doe', 'john@example.com', 'password123');
        const userId = newUser._id.toString();

        // Update user after a delay
        setTimeout(async () => {
            await updateUser(userId, { name: 'Jane Doe', email: 'jane@example.com' });
        }, 2000);

        // Delete user after another delay
        setTimeout(async () => {
            await deleteUser(userId);
        }, 4000);
    } catch (error) {
        console.error('Error during user operations:', error);
    }
}

testUserOperations();


  
  
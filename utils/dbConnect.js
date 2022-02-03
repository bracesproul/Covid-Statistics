import mongoose from 'mongoose';
require('dotenv').config({ path: 'ENV_FILENAME' });

const connection = {};

async function dbConnect() {
    if (connection.isConnected) return;
    const db = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); 
    connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect()  {
    if(connection.isConnected) {
        console.log('Already Connected to Database');
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connection is successful');
    } catch (error) {
        console.log('Database Connection Failed: ',error);
    }
}

export default dbConnect;
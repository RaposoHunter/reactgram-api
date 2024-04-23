import mongoose from 'mongoose';

const {
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD
} = process.env;

async function conn()
{
    try {
        const dbConn = await mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority&appName=Cluster0`)

        console.log('Connected to MongoDB!');

        return dbConn;
    } catch(e) {
        console.error(e);
    }
}

conn();

export default conn;
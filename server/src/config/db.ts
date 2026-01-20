import mongoose  from "mongoose";
import dns from "dns";

// Fix DNS resolution for MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const ConnectDB = async (): Promise<void> =>{
    try {
        const mongoUri = process.env.MONGO_URI;
        if(!mongoUri){
            throw new Error('Mongo URI not found in env vairables');
        }
      await mongoose.connect(mongoUri);
      console.log("connected to database successfully!!");
    } catch (error) {
       console.error('Database connection Failed: ', error);
       throw error;
    }
}

export default ConnectDB;
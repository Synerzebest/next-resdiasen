import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

let cachedDb: any = null;

async function connectToDatabase(uri: string) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri);
    const db = client.db('mydatabase');
    cachedDb = db;
    return db;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const url = process.env.MONGODB_URI || "";

        if (!url) {
            throw new Error("Mongodb url is undefined");
        }

        try {
            const db = await connectToDatabase(url);
            const announcements = await db.collection('announcements').find({}).toArray();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(announcements);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            res.status(500).json({ message: 'Error connecting to MongoDB' });
        }
    } else {
        res.status(400).json({ message: "Method unauthorized" });
    }
}

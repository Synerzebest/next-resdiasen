import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const url = process.env.MONGODB_URI || "";

        if(!url) {
            throw new Error("Mongodb url is undefined")
        }

        const client = await MongoClient.connect(url);
        const db = client.db('test');
        const messages = await db.collection('messages').find({}).toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(messages);
    } else {
        res.status(400).json({message: "Method unauthorized"})
    }
}
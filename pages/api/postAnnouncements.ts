import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const url = process.env.MONGODB_URI || "";

        if(!url) {
            throw new Error("Mongodb url is undefined")
        }

        try {
            const client = await MongoClient.connect(url);
            const db = client.db('mydatabase');

            const { text, author, userImageUrl, userId } = req.body;

            const announcement = {
                id: uuidv4(),
                text: text,
                date: new Date(),
                author: author,
                userImageUrl: userImageUrl,
                userId: userId
            };

            await db.collection('announcements').insertOne(announcement);
            client.close();

            res.status(201).json({ message: 'Announcement created successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'An error occurred while creating the announcement' });
        }
        

    } else {
        res.status(400).json({message: "Method unauthorized"})
    }
}

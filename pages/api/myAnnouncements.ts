import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(400).json({ error: 'userId parameter is required' });
        }

        const url = process.env.MONGODB_URI || "";

        if (!url) {
            throw new Error("Mongodb url is undefined");
        }

        try {
            const client = await MongoClient.connect(url);
            const db = client.db('mydatabase');
            const announcements = await db.collection('announcements').find({ userId }).toArray();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(announcements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(400).json({ message: "Method unauthorized" });
    }
}

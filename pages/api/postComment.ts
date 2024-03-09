import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId, InsertOneResult } from 'mongodb';


interface Comment {
    _id?: ObjectId;
    content: string;
    author: string;
    userImageUrl: string;
    postId: string;
    date: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const url = process.env.MONGODB_URI || "";

        if(!url) {
            throw new Error("Mongodb url is undefined")
        }

        const client = await MongoClient.connect(url);
        const db = client.db('test');
        
        try {
            const { content, postId, author, userImageUrl } = req.body;

            
            const result: InsertOneResult<Comment> = await db.collection<Comment>('comments').insertOne({
                content,
                author,
                userImageUrl,
                postId,
                date: new Date()
            });

            
            const createdComment: Comment = {
                _id: result.insertedId,
                content,
                author,
                userImageUrl,
                postId,
                date: new Date()
            };

            
            res.status(201).json(createdComment);
        } catch (error) {
            console.error("Erreur lors de la création du commentaire:", error);
            res.status(500).json({ message: "Erreur lors de la création du commentaire" });
        } finally {
            
            await client.close();
        }
    } else {
        res.status(400).json({ message: "Méthode non autorisée" });
    }
}

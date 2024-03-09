import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';
import Message from '../../models/Message';
import mongoose from 'mongoose';

let io: SocketServer | null = null;

mongoose.connect(process.env.MONGODB_URI || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!io) {
    io = new SocketServer({
    });

    io.on('connection', (socket) => {
      socket.on('chat message', async (msg) => {
        try {
          const newMessage = new Message({
            content: msg,
          });

          await newMessage.save(); // Save message in MongoDB

          io?.emit('chat message', msg); // Send the message to all the connected users
        } catch (err) {
          console.error('An error occurred while saving the message:', err);
        }
      });
    });
  }

  res.status(200).end();
};


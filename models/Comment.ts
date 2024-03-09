import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: string;
    userImageUrl: string;
    date: Date;
    post: string;
}

const commentSchema: Schema = new Schema({
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userImageUrl: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    }
});

export default mongoose.model<IComment>('Comment', commentSchema);

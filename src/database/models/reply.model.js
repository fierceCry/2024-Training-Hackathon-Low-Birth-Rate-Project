import { Schema, model } from 'mongoose';

const replySchema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  commentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
});

const Reply = model('Reply', replySchema);

export default Reply;
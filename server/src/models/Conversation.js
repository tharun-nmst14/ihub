import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    messages: [messageSchema]
  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

/**
 * IMPORTANT RULE:
 * One buyer can have only ONE conversation per item
 */
conversationSchema.index(
  { item: 1, buyer: 1 },
  { unique: true }
);

export default mongoose.model('Conversation', conversationSchema);

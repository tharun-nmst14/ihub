import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Suggestion', suggestionSchema);

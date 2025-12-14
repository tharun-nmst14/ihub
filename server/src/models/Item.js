import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  price: {
    type: Number,
    required: true
  },
  condition: Number,

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  images: {
  type: [String],
  default: []
},

  // ✅ NEW FIELDS
  status: {
    type: String,
    enum: ['active', 'sold', 'removed'],
    default: 'active'
  },

  soldAt: {
    type: Date,
    default: null
  },
  buyerStudentId: {
  type: String,
  default: null
}

}, { timestamps: true });

export default mongoose.model('Item', itemSchema);

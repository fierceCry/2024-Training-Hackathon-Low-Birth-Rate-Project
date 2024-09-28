import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  logId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date
  }
});

const User = mongoose.model('User', userSchema);

export default User;

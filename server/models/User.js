import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// CRUD Operations
UserSchema.statics.createRecord = async function(data) {
  const record = new this(data);
  return await record.save();
};

UserSchema.statics.getAllRecords = async function() {
  return await this.find(); // Fetch all records from MongoDB
};

UserSchema.statics.updateRecord = async function(id, data) {
  return await this.findByIdAndUpdate(id, data, { new: true });
};

UserSchema.statics.deleteRecord = async function(id) {
  return await this.findByIdAndDelete(id);
};

export default mongoose.model('User', userSchema);
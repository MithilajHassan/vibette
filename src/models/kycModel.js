import { Schema, model } from 'mongoose';

// Define the schema for KYC data
const KYCSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },  
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  idProof: {
    // Assuming you want to store the file path or URL
    type: String,
    required: true
  },
 
  paymentStatus:{
    type: Boolean,
    default: false
  },
  actionTaken:{
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for KYC data using the schema
const KYC = model('KYC', KYCSchema);

export default KYC;

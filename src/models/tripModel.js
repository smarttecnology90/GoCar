import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({

carType:{
    type:String,
    enum:["Economy","Large","VIP","Pet"],
    required:true
},
userId: {
     type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: true 
},
driverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true   
},
currentLocation: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
},
destination: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
},
passengerNo:{
    type:Number,
    enum:[1,2,3,4,5,6],
    required:true
},
luggageNo:{
    type:Number,
    enum:[0,1,2,3,4,5],
    required:true
},
// payment 
paymentInfo: {
  method: { type: String, enum: ["Cash", "PayPal"], required: true },
  status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" },
  transactionId: String,
  paidAt: Date
},
rating: {
  type: String,
  enum: ["Bad", "Okay", "Good", "Awesome", null],
  default: null
},
feedback: {
  type: String,
  default: ""
},
blockedDriver: {
  type: Boolean,
  default: false
},

status: {
  type: String,
  enum: ["Requested", "Accepted", "InProgress", "Completed", "Cancelled", "Paid","Scheduled", "Pending"],
  default: "Requested"
},
scheduledAt: {
  type: Date,
  default: null 
},


}, { timestamps: true });

tripSchema.index({ currentLocation: '2dsphere' });
tripSchema.index({ destination: '2dsphere' });

export default mongoose.model("Trip", tripSchema);

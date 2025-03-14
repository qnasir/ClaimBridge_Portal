const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  approvedAmount: {
    type: Number,
  },
  reviewedBy: {
    type: String,
  },
  comments: {
    type: String,
  },
  documents: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Claim", ClaimSchema);

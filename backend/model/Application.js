const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Reference to the Job
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the Candidate (User)
  resume: { type: String, required: true }, // URL to the resume file
  coverLetter: { type: String }, // Optional: Cover letter
  status: { 
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected'],
    default: 'Applied'
  }, // Application status
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);

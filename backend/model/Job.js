const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String }, // Optional: Location of the job
  skills: { type: [String], required: true }, // List of skills required for the job
  salaryRange: { type: String }, // Optional: Salary range for the job
  deadline: { type: Date, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the recruiter
  status: { type: String, enum: ['active', 'closed'], default: 'active' }, // Job status (Active/Closed),
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobLocationType: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'remote' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);

//api for recruiter- post new job,update a job,delete a job,close a job,can see all the jobs that is posted by them 

//api for candidate- apply for job,get all job,get a specific job

const Job = require('../model/Job');
const User = require('../model/User');

//Create a new job 
const createJob = async (req, res) => {
  try {
      const { recruiterId, title, description, location, skills, salaryRange, deadline } = req.body;
      
      const recruiter = await User.findById(recruiterId);
      if (!recruiter || recruiter.role !== 'recruiter') {
          return res.status(400).json({ message: "Invalid recruiter ID" });
      }

      const job = new Job({
          recruiter: recruiterId,
          title,
          description,
          location,
          skills,
          salaryRange,
          deadline,
          postedBy: recruiterId, 
          status: 'Active'
      });

      const savedJob = await job.save();
      res.status(201).json({ message: "Job posted successfully", job: savedJob });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// Get all jobs posted by a specific recruiter
const getJobsByRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    console.log(recruiterId);

    // Populate recruiter information including companyName
    const jobs = await Job.find({ recruiter: recruiterId }).populate({
      path: 'recruiter', // Assuming recruiter is the reference field in Job
      select: 'companyName name', // Include fields you want, like companyName or recruiter's name
    });

    // Map jobs to include recruiter details directly in the response
    const formattedJobs = jobs.map(job => ({
      ...job.toObject(),
      recruiterName: job.recruiter?.name || 'Unknown', // If recruiter's name is available
      companyName: job.recruiter?.companyName || 'Unknown Company',
    }));

    res.status(200).json({ message: "Jobs by recruiter", jobs: formattedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Close a job (update status)
const closeJob = async (req, res) => {
  try {
      const { jobId } = req.params;
      const job = await Job.findByIdAndUpdate(jobId, { status: 'Closed' }, { new: true });

      if (!job) {
          return res.status(404).json({ message: "Job not found" });
      }

      res.status(200).json({ message: "Job closed successfully", job });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


//get all jobs
const getAllJobs=async(req,res)=>{
    try {
        const jobs=await Job.find()
        .populate({
          path: 'recruiter',
          select: 'companyName', // Include the fields you need from the recruiter
        });
        res.status(200).json({message:"All jobs",jobs});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

//get job by id 
const getJobById=async(req,res)=>{
    try {
        const job=await Job.findById(req.params.jobId);
        if(!job){
            return res.status(404).json({message:"Job not found"});
        }
        res.status(200).json({message:"Job found",job});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

//update the job
const updateJob = async (req, res) => {
    try {
      const updatedJob = await Job.findByIdAndUpdate(
        req.params.jobId,
        req.body,
        { new: true }
      );
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

//delete the job 
const deleteJob = async (req, res) => {
    try {
      const deletedJob = await Job.findByIdAndDelete(req.params.jobId);
      if (!deletedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports={createJob,
    getJobsByRecruiter,
    closeJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob};
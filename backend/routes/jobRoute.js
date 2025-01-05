const express =require('express');
const router=express.Router();
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    closeJob
    ,getJobsByRecruiter
  } = require('../controller/jobController'); // Use correct path
  

router.post('/jobs',createJob);
router.get('/jobs',getAllJobs);
router.get('/jobs/recruiter/:recruiterId',getJobsByRecruiter);
router.get('/jobs/:jobId',getJobById);
router.put('/jobs/:jobId',updateJob);
router.delete('/jobs/:jobId',deleteJob);
router.patch('/jobs/:jobId/close', closeJob);

module.exports=router;


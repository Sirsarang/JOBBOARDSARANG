const express = require('express');
const {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  JOB_CATEGORIES,
} = require('../constants/jobOptions.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    experienceLevels: EXPERIENCE_LEVELS,
    jobTypes: JOB_TYPES,
    categories: JOB_CATEGORIES,
  });
});

module.exports =  router;

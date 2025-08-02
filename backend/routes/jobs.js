const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const allowedCategories = require('../constants/jobOptions').JOB_CATEGORIES;
const { protect } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const { EXPERIENCE_LEVELS, JOB_TYPES, JOB_CATEGORIES } = require('../constants/jobOptions.js');



router.post('/', protect, async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            category,
            tags,
            requiredSkills,
            description,
            salary,
            experienceLevel,
            jobType
        } = req.body;

        // Required field checks
        if (!title || title.trim().length < 3) {
            return res.status(400).json({ error: 'Title must be at least 3 characters long' });
        }
        if (!company || company.trim().length < 2) {
            return res.status(400).json({ error: 'Company name is required' });
        }
        if (!location || location.trim().length < 2) {
            return res.status(400).json({ error: 'Location is required' });
        }
        if (!category || !JOB_CATEGORIES.includes(category)) {
            return res.status(400).json({ error: 'Invalid or missing category' });
        }
        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ error: 'At least one tag is required' });
        }
        if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
            return res.status(400).json({ error: 'At least one required skill is needed' });
        }
        if (!description || description.trim().length < 50) {
            return res.status(400).json({ error: 'Job description must be at least 50 characters long' });
        }
        if (!experienceLevel || !EXPERIENCE_LEVELS.includes(experienceLevel)) {
            return res.status(400).json({ error: 'Invalid experience level' });
        }
        if (!jobType || !JOB_TYPES.includes(jobType)) {
            return res.status(400).json({ error: 'Invalid job type' });
        }
        if (salary && salary.trim().length > 0 && salary.length > 100) {
            return res.status(400).json({ error: 'Salary value too long' });
        }
        

        const newJob = new Job({
            title,
            company,
            location,
            category,
            tags,
            requiredSkills,
            description,
            salary,
            experienceLevel,
            jobType,
            user: req.user._id
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/mine', protect, async (req, res) => {
    try {
        const userId = new ObjectId(req.user._id);
        const jobs = await Job.find({ user: userId }).sort({ postedAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { search,
            category,
            location,
            skills,
            tags,
            minSalary,
            maxSalary,
            page = 1,
            limit = 10,
            jobType,
            experienceLevel,
            mine } = req.query;

        const query = {};

        if (search) query.$text = { $search: search };
        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (skills) query.requiredSkills = { $in: skills.split(',') };
        if (tags) query.tags = { $in: tags.split(',') };
        if (minSalary || maxSalary) {
            query.salary = {};
            if (minSalary) query.salary.$gte = minSalary;
            if (maxSalary) query.salary.$lte = maxSalary;
        }
        if (jobType) query.jobType = jobType;
        if (experienceLevel) query.experienceLevel = experienceLevel;

        if (mine === 'true' && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            query.user = decoded.id;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const jobs = await Job.find(query)
            .populate('user', 'name')
            .sort({ postedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            results: jobs
        });
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        if (job.user.toString() !== req.user._id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updated);
    } catch (err) {
        console.error('Error updating job:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});



router.delete('/:id', protect, async (req, res) => {
    try {

        const job = await Job.findById(new ObjectId(req.params.id));
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.user.toString() !== req.user._id) {
            return res.status(403).json({ error: 'Not authorized to delete' });
        }
        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
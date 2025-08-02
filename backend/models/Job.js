const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { EXPERIENCE_LEVELS, JOB_TYPES, JOB_CATEGORIES } = require('../constants/jobOptions.js');


const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: JOB_CATEGORIES,
        required: true,
        index: true
    },
    tags: {
        type: [String],
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: {
        type: [String],
        required: true,
        index: true
    },
    salary: {
        type: String,
        default: "Not specified"
    },
    experienceLevel: {
        type: String,
        enum: EXPERIENCE_LEVELS,
        required: true,
    },
    jobType: {
        type: String,
        enum: JOB_TYPES,
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

jobSchema.index({ title: 'text', description: 'text', tags: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);
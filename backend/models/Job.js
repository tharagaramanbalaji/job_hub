import { Schema, model } from 'mongoose';

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: [true, 'Job type is required'],
    },
    posterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Array of seeker IDs who saved this job — replaces saved_jobs join table
    savedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default model('Job', jobSchema);

import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      public_id: {
        type: String
      },
      secure_url: {
        type: String
      },
    },
    instructor: {
          type: String,
          required: true
      },
    duration: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    salary: {
      type: String,
    },
    roles: {
      type: String,
    },
    skills: {
      type: String,
      required: true
    },
    eligibility: {
      type: String,
      required: true
    },
    lectures: [
      {
        title: String,
        description: String,
        lectureThumbnail: {
          public_id: {
            type: String,
          },
          secure_url: {
            type: String,
          },
        },
      },
    ],
    numberOfLectures: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);

export default Course;
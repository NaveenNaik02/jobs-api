import mongoose, { Document, Schema } from "mongoose";
interface JobType extends Document {
  company: string;
  position: string;
  status: string;
  createdBy: mongoose.Types.ObjectId;
}
const JobSchema = new mongoose.Schema<JobType>(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<JobType>("Job", JobSchema);

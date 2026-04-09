const { Schema, model } = require("mongoose");

const jobSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    
    location: String,

    status:{
        type: String,
        enum: ["Applied", "Interview", "Rejected", "Offer"],
        default: "Applied"
    },
    appliedDate:{
        type: Date,
        default: Date.now,
    },
    jobLink: String,

    repoId: { 
        type: Schema.Types.ObjectId, 
        ref: "Repo" 
    }
    
}, { timestamps: true });

module.exports = model("Job", jobSchema);
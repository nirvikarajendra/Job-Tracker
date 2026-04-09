const { Schema, model } = require("mongoose");

const repoSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  repoId: { 
    type: Number, 
    required: true 
  },

  name: { 
    type: String, 
    required: true 
  },

  description: String,

  htmlUrl: String,

  repoType: ["private", "public"],

  createdAt: Date

}, { timestamps: true });

module.exports = model("Repo", repoSchema);
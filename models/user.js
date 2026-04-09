const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    githubId: { 
        type:String, 
        required: true, 
        unique: true
    },
    
    username: { 
        type: String, 
        required: true 
    },
    avatar: String,

    htmlUrl: String,

    publicRepos: Number,

    planName: String,

    createdAt: Date,
    
    updatedAt: Date

}, { timestamps: true });

module.exports = model("User", userSchema);


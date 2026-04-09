require("dotenv").config();

const express = require("express");
const isLoggedIn = require("../middlewares/authentication");
const axios = require("axios");
const Repo = require("../models/repo");
const Job = require("../models/job");


const router = express.Router();

router.get("/dashboard", isLoggedIn, async (req, res) => {
  let repos = [];
  let jobs = [];
  try {
    jobs = await Job.find({ userId: req.session.user._id }).populate("repoId");
    reposRes = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${req.session.user.access_token}` }
    });
    repos = reposRes.data;
  } catch (err) {
    console.error("Error fetching GitHub repos:", err.message);
  }

  res.render("dashboard", {
    user: req.session.user,
    repos,
    jobs
  });
});

router.post("/job/create", async (req, res) => {
  const {company, role, location, status, appliedDate, jobLink, repoId} = req.body;

  if(repoId){
    const reposRes = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${req.session.user.access_token}`
        }
      }
    );

    const repo = reposRes.data.find(r => r.id == Number(repoId));

    if (!repo) return res.status(400).send("Selected repo not found");

    const storedRepo = await StoreRepoDetails(repo, req.session.user._id);
   
    await Job.create({
      userId: req.session.user._id,
      company,
      role,
      location,
      status,
      appliedDate,
      jobLink,
      repoId: storedRepo._id 
  });
  }
  res.redirect('/repo/dashboard');
})

router.post("/job/update", async (req, res) => {
  const { jobId, status } = req.body;
  await Job.findByIdAndUpdate(jobId, {status});

  res.redirect("/repo/dashboard");
})

async function StoreRepoDetails(repo, userId){

    let repository = await Repo.findOne({
        repoId: repo.id,
        userId: userId
    });
    if(!repository)
    {
      repository = await Repo.create({
        userId: userId,
        repoId: repo.id,
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url, 
        repoType: repo.visibility,
        createdAt: repo.created_at
      })
    }
    else{
      repository.name = repo.name
      repository.description = repo.description,
      repository.htmlUrl = repo.html_url, 
      repository.repoType = repo.visibility
      await repository.save();
    }
    return repository;
}

module.exports = router;
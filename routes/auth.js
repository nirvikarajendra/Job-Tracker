require("dotenv").config();

const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/user")


router.get("/github", (req, res) => {

    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    const scope = "repo read:user";
    const state = Math.random().toString(36).substring(2);

    const githubURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    res.redirect(githubURL);
});

router.get("/github/callback",async (req, res) => {
    const code = req.query.code;
    try {
        // exchange code for token
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id : process.env.GITHUB_CLIENT_ID ,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
            },
            {  headers: { Accept: "application/json" } }
        );

        console.log(tokenRes);

        const access_token = tokenRes.data.access_token;

        const response = await axios.get("https://api.github.com/user",
           { headers: { Authorization: `Bearer ${access_token}` }}
        )
        const userData = await response.data;

        const user = await StoreUserDetails(userData);

        req.session.user = {
            githubId: user.githubId,
            username: user.username,
            avatar: user.avatar,
            _id: user._id,
            access_token: access_token
        };

        res.redirect("/repo/dashboard");

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy( () => {
        res.redirect("/");
    });
});

async function StoreUserDetails(gitUser){
    
    let user = await User.findOne({ githubId: gitUser.id })

    if (!user) {
        // Create new user
        user = await User.create({
          githubId: gitUser.id,
          username: gitUser.login,
          avatar: gitUser.avatar_url,
          htmlUrl: gitUser.html_url,
          publicRepos: gitUser.public_repos,
          planName: gitUser.plan?.name,
          createdAt: gitUser.created_at,
          updatedAt: gitUser.updated_at
        });
      } else {
        // updating info
        user.username = gitUser.login;
        user.avatar = gitUser.avatar_url;
        user.htmlUrl = gitUser.html_url;
        user.publicRepos = gitUser.public_repos;
        user.updatedAt = gitUser.updated_at;
        await user.save();
      }
      return user;
}


module.exports = router;
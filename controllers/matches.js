const match_router = require('express').Router(),
mongoose = require('mongoose');

match_router.post("/new", (req, res) => {  
    res.send("Match Successfully Created!");
  });

  module.exports = match_router;
const mongoose = require("mongoose"),
    Club = require("../models/club"),
    players_router = require("express").Router();

    players_router.post("/players/new",(req,res)=>{
        let player = req.body.Player;
        res.send("Player created!")
    });


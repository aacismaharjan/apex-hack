const mongoose = require("mongoose");
const dotenv = require("dotenv");



process.on("uncaughtException", (err) => {
    console.log(err);
    console.log("UNCAUGHT EXCEPTION Shutting down...");
    process.exit(1);
})

dotenv.config({path: "./config.env"});
const app = require("./app");

const DB = process.env.DATABASE;

const port = process.env.PORT || 3000;


mongoose
    .connect(DB, {
    })
    .then(()=> console.log("DB Connection successful."));

const server = app.listen(port, ()=> {
    console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLER REJECTION Shutting down...");
    server.close(()=> {
        process.exit(1);
    });
})
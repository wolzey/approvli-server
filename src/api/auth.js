const authRouter = require("express").Router();

authRouter.get("/complete", (req, res) => {
  console.log(req.query);

  res.json("ok");
});

// test pr

module.exports = authRouter;

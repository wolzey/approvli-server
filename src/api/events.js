const eventRouter = require("express").Router();
const Check = require("../models/Check");
const WATCHABLE_EVENTS = ["pull_request"];

eventRouter.post("/", async (req, res) => {
  const event = req.header("X-GitHub-Event");
  const body = req.body;
  const { pull_request, installation } = body;

  if (!WATCHABLE_EVENTS.includes(event)) return res.json("event not supported");

  const hasDesign = /design/i;

  const hasDesignLabel =
    pull_request.labels &&
    pull_request.labels.find(label => hasDesign.test(label.name));

  if (!hasDesignLabel) return res.json("Nothing to do... Label not added");
  // Needs to create check in DB, initialization will create this.

  await Check.findOrCreate(
    {
      "pull_request.id": pull_request.id
    },
    {
      pull_request: {
        id: pull_request.id,
        body: pull_request.body,
        number: pull_request.number
      },
      user: pull_request.user,
      owner: pull_request.head.repo.owner,
      repo: pull_request.head.repo.name,
      status: "in_progress",
      head_sha: pull_request.head.sha,
      installation_id: installation.id,
      output: {
        title: "Waiting on Design Approval",
        summary: "Needs approval from a designer",
        text:
          "We have sent a request to design. Once approved this check will update with their response."
      }
    }
  );

  res.json("ok");
});

module.exports = eventRouter;

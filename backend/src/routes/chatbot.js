const express = require("express");

function createChatbotRoutes(chatbotController) {
  const router = express.Router();

  router.post("/message", chatbotController.httpProcessMessage);

  return router;
}

module.exports = { createChatbotRoutes };

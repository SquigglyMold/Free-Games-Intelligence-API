/**
 * Vercel serverless function entry.
 * Serves the Express app for all routes (see vercel.json rewrites).
 * Requires the built app from dist (run "npm run build" before deploy).
 */
require('dotenv').config();

const app = require('../dist/app').default;

module.exports = app;

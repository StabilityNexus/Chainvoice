// Runs in the real Node process before any test, so the zone reaches every
// worker; test files only see a copy of process.env, so setting TZ there has
// no effect. A fixed zone ahead of UTC makes the UTC-day tests meaningful on
// any machine, including UTC CI runners.
module.exports = () => {
  process.env.TZ = "Asia/Kolkata";
};

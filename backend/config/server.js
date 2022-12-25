module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  iPayKey: env('iPayKey'),
  iPayVid: env('iPayVid'),
  iPaySecret: env('iPaySecret'),
});

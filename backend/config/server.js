module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1338),
    auth: {
      secret: env('ADMIN_JWT_SECRET', '0acec58d3e2cf402909e0c7f69da6ae1'),
    },
  },
});

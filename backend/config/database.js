module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'prosperamdb-postgres'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'prosperamdb'),
        username: env('DATABASE_USERNAME', 'prosperamdb'),
        password: env('DATABASE_PASSWORD', 'prosperamdb'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});

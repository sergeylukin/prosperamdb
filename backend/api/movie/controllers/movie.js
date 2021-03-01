'use strict';
const { sanitizeEntity } = require('strapi-utils');
const fetch = require('node-fetch');

module.exports = {
  async findOne(ctx) {
    const { imdbID } = ctx.params;

    let entity = await strapi.query('movie').findOne({ imdbID });
    if (!entity) {
      if (/\w{2}\d{6,}/.test(imdbID)) {
        try {
          entity = await strapi.query('movie').create({
            imdbID,
            fetchDataFromRemote: true
          });
        } catch (err) {
          throw strapi.errors.notFound("Not found")
        }
      } else {
        throw strapi.errors.badRequest("Not found")
      }
    }
    return sanitizeEntity(entity, { model: strapi.models.movie });
  },

  async find(ctx) {
    let entities = []
    if (ctx.query._q) {
      const query = ctx.query._q
      let lastSearch = await strapi.services.search.findOne({
        query
      })
      let now = new Date()
      let lastSyncTime
      let hoursSinceLastSync
      if (lastSearch) {
        lastSyncTime = new Date(lastSearch.lastSyncDateTime)
        hoursSinceLastSync = Math.floor(parseInt((now.getTime() - lastSyncTime.getTime())/1000, 10) / 3600)
      }
      if (lastSearch && hoursSinceLastSync < 12) {
        entities = await strapi.services.result.find({ }, ['search', 'search.id']);
      } else {
        console.log('Did not find previous searches or it is expired - GO FOR API')
        let search = lastSearch
        if (!search) {
          search = await strapi.entityService.create(
            {
              data: {
                query,
                lastSyncDateTime: new Date()
              }
            },
            { model: 'search' }
          )
        }
        const OMDB = strapi.store({
          environment: strapi.config.environment,
          type: 'plugin',
          name: 'prosperamdb-omdb',
        })
        const apiKey = await OMDB.get({ key: 'apiKey' })
        const result = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
        let response = await result.json()
        if (response.Error) {
          throw new Error(response.Error)
        }
        console.log(response)
        if (response.Response) {
          response.Search.map(async (movie) => {
            const data = {
              imdbID: movie.imdbID,
              title: movie.Title,
              poster: movie.Poster,
              year: movie.Year,
              search,
            }
            entities.push(data)
            console.log(data)
            try {
              const result = await strapi.entityService.create(
                { data },
                { model: 'result' }
              )
            } catch(err) {
              console.log('bad bad, hiding such stuff is bad..atm in a rush')
            }
          })
        }
      }
      // console.log(lastSearch)
      // entities = await strapi.services.movie.search(ctx.query);
    } else {
      entities = await strapi.services.movie.find(ctx.query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.movie }));
  },
};

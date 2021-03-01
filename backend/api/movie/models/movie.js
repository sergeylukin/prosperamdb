'use strict';
const fs = require('fs')
const slugify = require('slugify')
const fetch = require('node-fetch');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */
const fetchMovie = async (imdbID) => {
  const OMDB = strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: 'prosperamdb-omdb',
  })
  const apiKey = await OMDB.get({ key: 'apiKey' })
  const result = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
  let response = await result.json()
  if (response.Error) {
    throw new Error(response.Error)
  }
  let movie = {}
  for (let key in response) {
    if (!response.hasOwnProperty(key)) continue;
    switch (key) {
      case "Title": movie.title = response[key]; break;
      case "Year": movie.year = parseInt(response[key], 10); break;
      case "Rated": movie.rated = response[key]; break;
      case "Released": movie.released = response[key]; break;
      case "Runtime": movie.runtime = response[key]; break;
      case "Genre": movie.genre = response[key]; break;
      case "Director": movie.director = response[key]; break;
      case "Writer": movie.writer = response[key]; break;
      case "Actors": movie.actors = response[key]; break;
      case "Plot": movie.plot = response[key]; break;
      case "Language": movie.language = response[key]; break;
      case "Country": movie.country = response[key]; break;
      case "Awards": movie.awards = response[key]; break;
      case "Poster": movie.poster = response[key]; break;
      case "Metascore": movie.metascore = response[key]; break;
      case "imdbRating":
        movie.imdbRating = parseFloat(response[key]);
        if (isNaN(movie.imdbRating)) movie.imdbRating = null
        break;
      case "imdbVotes":
        movie.imdbVotes = parseInt(response[key].replace(/[\.\,]/g,''), 10);
        if (isNaN(movie.imdbVotes)) movie.imdbVotes = null
        break;
      case "imdbID": movie.imdbID = response[key]; break;
      case "Type": movie.type = response[key]; break;
      case "DVD": movie.DVD = response[key]; break;
      case "BoxOffice": movie.boxOffice = response[key]; break;
      case "Production": movie.production = response[key]; break;
      case "Website": movie.website = response[key]; break;
      case "Response": movie.response = response[key] === 'True'; break;
    }
  }
  return movie
}

module.exports = {
  lifecycles: {
    // Called before an entry is created
    async beforeCreate(data) {
      if (!data.imdbID) {
        throw new Error('IMDB id should not be blank')
      }
      if (data.fetchDataFromRemote) {
        try {
          const movie = await fetchMovie(data.imdbID)
          movie.fetchDataFromRemote = false
          for (let key in movie) {
            data[key] = movie[key]
          }
          // await strapi.query('movie').update({ id: model.id }, movie)
        } catch (err) {
          throw strapi.errors.serverUnavailable(err)
        }
      }
      if (data.title && !data.slug) {
        data.slug = slugify(data.title, {lower: true}) + '-' + data.id;
        // await strapi.query('movie').update({ id: model.id }, { slug })
      }
    },
    async beforeUpdate(params, data) {
      const model = await strapi.query('movie').findOne({ id: params.id });
      try {
        if (data.fetchDataFromRemote) {
          const movie = await fetchMovie(data.imdbID)
          console.log(movie)
          for (let key in movie) {
            data[key] = movie[key]
          }
          data.fetchDataFromRemote = false
        }
        if (!model.slug) {
          const title = data.title ? data.title : model.title
          if (title) {
            data.slug = slugify(title, {lower: true}) + '-' + params.id;
          }
        }
      } catch(err) {
        throw strapi.errors.serverUnavailable(err)
      }
    },
    async afterCreate(model) {
    },
  },
};

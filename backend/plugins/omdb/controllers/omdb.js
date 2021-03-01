'use strict';

/**
 * omdb.js controller
 *
 * @description: A set of functions called "actions" of the `omdb` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // add your own logic here.

    // send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  updateSettings: async (ctx) => {
    const {user} = ctx.state
    const {apiKey} = ctx.request.body

    // Ensure user is admin
    if (user.roles[0].id != 1) {
      return ctx.unauthorized("Only administrators allowed")
    }

    if (!apiKey) {
      return ctx.throw(400, "Please provide a private key")
    }

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'prosperamdb-omdb',
    })

    const result = await pluginStore.set({ key: 'apiKey',  value: apiKey })

    // send 200 `ok`
    ctx.send({
      result
    });
  },

  retrieveSettings: async (ctx) => {
    const {user} = ctx.state

    // Ensure user is admin
    if (user.roles[0].id != 1) {
      return ctx.unauthorized("Only administrators allowed")
    }

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'prosperamdb-omdb',
    })

    const apiKey = await pluginStore.get({ key: 'apiKey' })

    ctx.send({
      apiKey: apiKey ? apiKey : ''
    });
  }
};
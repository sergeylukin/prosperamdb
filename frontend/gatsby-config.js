module.exports = {
  siteMetadata: {
    title: `ProsperaMDB`,
    description: `Little movies search app`,
    author: `@sergey_lukin`,
    gatsbyBackendURL: process.env.GATSBY_BACKEND_URL,
    baseURL: `https://prosperamdb.sergeylukin.com`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    "gatsby-plugin-theme-ui",
    `gatsby-theme-style-guide`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: process.env.GATSBY_BACKEND_URL,
        queryLimit: 10000,
        contentTypes: [`movie`],
      },
    },
  ],
}

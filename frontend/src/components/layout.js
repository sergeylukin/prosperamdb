/** @jsx jsx */
import { Flex, Box, Styled, jsx } from "theme-ui"
import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import "normalize.css"

import Header from "./header"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Styled.root>
      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
        <Header siteTitle={data.site.siteMetadata.title} />
        <main
          sx={{
            flex: '1 1 auto',
          }}
          >
          <Box variant="variants.siteContainer">
          {children}
          </Box>
        </main>
        <footer>
          <Styled.p sx={{ p: 4, textAlign: 'center' }}>
            Built with 
            <Styled.p as="span" sx={{ color: '#ff6032' }}>{` ♥ `}</Styled.p>
            in Tel Aviv
          </Styled.p>
        </footer>
      </Flex>
    </Styled.root>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

/** @jsx jsx */
import { Box, Text, Styled, jsx } from "theme-ui"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <Box
    as="header"
    variant="variants.siteHeader"
  >
    <div
      sx={{
        margin: `0 auto`,
        maxWidth: 960,
        py: 4,
        px: 3,
      }}
    >
      <Styled.h1 sx={{ margin: 0 }}>
        <Link
          to="/"
          sx={{
            textDecoration: `none`,
          }}
        >
          <Text variant="variants.siteTitle">{siteTitle}</Text>
        </Link>
      </Styled.h1>
    </div>
  </Box>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

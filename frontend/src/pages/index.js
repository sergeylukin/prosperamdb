/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { Link, graphql } from "gatsby"
import { Button, Label, Input, Flex, Styled, Text, jsx, Grid, Box } from "theme-ui"
import Img from 'gatsby-image'
import axios from 'axios'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  const { gatsbyBackendURL } = data.site.siteMetadata
  const [searchQuery, setSearchQuery] = useState('The Godfather')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])

  useEffect(() => {
    const onDidMount = async () => {
      if (typeof window !== `undefined` && window.location.href.substr(-1) !== `/`) {
        // setRedirectTo(`${window.location.href}/`)
      }

      // if (!movie.title) {
      //   const url = `${gatsbyBackendURL}/movies/${imdbID}`
      //   try {
      //     const entity = await axios.get(url)
      //     setMovie(entity.data)
      //     setIsMovieLoaded(true)
      //   } catch (err) {
      //     setMovie(null)
      //   }
      // }
    }
    onDidMount()
  }, [])

  const performSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery) return false;

    try {
      setIsLoading(true)
      const url = `${gatsbyBackendURL}/movies/?_q=${searchQuery}`
      const entities = await axios.get(url)
      setResults(entities.data)
      setIsLoading(false)
    } catch (err) {
      setResults([])
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <SEO title="Home" />
      <Label sx={{ fontWeight: 'bold', fontSize: 2, }}>Search for your favorite title:</Label>
      <form onSubmit={performSearch}>
        <Flex mt={2}
          sx={{
            flexDirection: ['column', null, 'row', null],
            alignItems: 'stretch',
          }}>
          <Box
            sx={{
              flexGrow: '2',
              pr: [0, null, 3, null],
            }}
            >
            <Input
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
              }}
              sx={{
                width: '100%',
              }}
            />
          </Box>
          <Box
            sx={{
              mt: [2, null, 0, null],
              textAlign: ['center', null, 'left', null],
            }}
            >
            <Button variant={searchQuery ? "primary" : "disabled"}
              type="submit"
              sx={{
                width: ['100%', null, 'auto', null],
                height: '100%'
              }}>Search</Button>
          </Box>
        </Flex>
      </form>
      <Flex pt={4}
        sx={{
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
        { isLoading ? <Box sx={{ textAlign: 'center' }}>Fetching...</Box> : (
          <Box>
            {results.map(item => {
              return (
                <Grid
                  gap={0}
                  columns={[3, '1fr 5fr 1fr']}
                  key={item.imdbID}
                  variant="variants.movieRow"
                  >
                  <Flex sx={{ justifyContent: 'center', alignItems: 'center' }} variant="variants.movieLink"><Link to={`/title/${item.imdbID}`}><img src={item.poster} width={80}/></Link></Flex>
                  <Box variant="variants.movieLink" p={3}><Link to={`/title/${item.imdbID}`}>{item.title}</Link></Box>
                  <Box variant="variants.movieLink" p={3}>{item.year}</Box>
                </Grid>
              )
            })}
          </Box>
        )}
      </Flex>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        gatsbyBackendURL
      }
    }
  }
`

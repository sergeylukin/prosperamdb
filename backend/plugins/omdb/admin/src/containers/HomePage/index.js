import React, { useState, useEffect, memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {
  request
} from 'strapi-helper-plugin'

import {Container, Block} from '../../components/StrapiStyled'
import {InputText, Button, Padded} from '@buffetjs/core'

const HomePage = () => {

  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    const loadApiKey = async () => {
      const response = await request(`/${pluginId}/settings`, {
        method: 'GET'
      })
      
      const {apiKey} = response
      setApiKey(apiKey)
    }
    loadApiKey()
  }, [])

  const updatedApiKey = async (e) => {
    try {
      e.preventDefault()
      strapi.lockApp()

      const response = await request(`/${pluginId}/settings`, {
        method: 'POST',
        body: {apiKey}
      })
      strapi.notification.success('Success')
    } catch(err) {
      console.log('err ', err)
      strapi.notification.error(err.toString())
    }
    strapi.unlockApp()
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <Container>
          <Block>
            <h1>OMDB API key</h1>
            <p>Save your OMDB API key here</p>
            <form onSubmit={updatedApiKey}>
              <InputText
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                name="input"
                type="password"
                placeholder="OMDB API key"
              />
              <Padded top>
                <Button color="primary" label="Submit" type="submit" />
              </Padded>
            </form>
          </Block>
        </Container>
      </div>
    </div>
  );
};

export default memo(HomePage);

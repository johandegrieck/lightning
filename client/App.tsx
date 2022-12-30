import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import PostForm from 'components/PostForm';
import Posts from 'components/Posts';
import Spotify from 'components/Spotify';
import SpotifyLogin from 'components/SpotifyLogin';
import SongRequests from 'components/SongRequests';
import './App.scss';
import { Button } from 'reactstrap';

export default class App extends React.Component {
  render() {
    return (
        <>
        <SpotifyLogin>
        </SpotifyLogin>
      
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} sm={8}>
              <Spotify />
            </Col>
            <Col xs={12} sm={4}>
            <SongRequests />
            </Col>
            
          </Row>
        </Container>
        </>
      
    );
  }
}

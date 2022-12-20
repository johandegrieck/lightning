import React from 'react';
import { Spinner, Card, CardTitle, CardBody, CardText, Alert, Jumbotron } from 'reactstrap';
import { SongRequest } from 'types';
import api from 'lib/api';

interface State {
  songRequests: null | SongRequest[];
  isFetching: boolean;
  error: null | string;
}

export default class SongRequests extends React.Component<{}, State> {
  state: State = {
    songRequests: null,
    isFetching: false,
    error: null,
  };

  // As soon as this component mounts, start fetching songRequests
  componentDidMount() {
    this.getSongRequests();
  }

  render() {
    const { songRequests, isFetching, error } = this.state;

    let content;
    if (songRequests) {
      if (songRequests.length) {
        content = songRequests.map(p => (
          <Card key={p.id} className="mb-3">
            <CardBody>
              <CardTitle tag="h4">{p.name} says:</CardTitle>
              <CardText>{p.content}</CardText>
            </CardBody>
          </Card>
        ));
      } else {
        content = (
          <Jumbotron>
            <h2 className="text-center">No songRequests yet.</h2>
            <p className="text-center">Why not be the first?</p>
          </Jumbotron>
        );
      }
    } else if (isFetching) {
      content = <Spinner size="lg" />;
    } else if (error) {
      content = (
        <Alert color="danger">
          <h4 className="alert-heading">Failed to fetch songRequests</h4>
          <p>{error}. <a onClick={this.getSongRequests}>Click here</a> to try again.</p>
        </Alert>
      );
    }

    return (
      <>
        <h2>Latest SongRequests</h2>
        {content}
      </>
    );
  }

  // Fetch songRequests from the API and update state
  private getSongRequests = () => {
    this.setState({ isFetching: true });
    api.getSongRequests().then(songRequests => {
      this.setState({
        songRequests,
        isFetching: false,
      });
    })
    .catch(err => {
      this.setState({
        error: err.message,
        isFetching: false,
      })
    });
  };
}

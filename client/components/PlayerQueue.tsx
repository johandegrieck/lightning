import React from 'react';
import { Spinner, Card, CardTitle, CardBody, CardText, Alert, Jumbotron } from 'reactstrap';
import axios from 'axios';

interface State {
  songsInQueue: null;
  isFetching: boolean;
  error: null | string;
  
}

export default class PlayerQueue extends React.Component<{}, State> {
  state: State = {
    songsInQueue: null,
    isFetching: false,
    error: null
  };

  // As soon as this component mounts, start fetching songsInQueue
  componentDidMount() {
    this.getPlayerQueue();
  }

  render() {
    const { songsInQueue, isFetching, error } = this.state;

    let content;
    if (songsInQueue) {
      if (songsInQueue.length) {
        content = songsInQueue.map(p => (
          <div className='track' key={p.id} >
                <div className="track_art">
                    <img className='pull-left'  height={p.album.images[2].height} width={p.album.images[2].width} src={p.album.images[2].url}  />
                </div>  
                <div className="track__title"><p>{p.name}</p><p>{p.album.artists[0].name}</p></div>
            </div>

          

        ));
      } else {
        content = (
          <Jumbotron>
            <h2 className="text-center">No songsInQueue yet.</h2>
            <p className="text-center">Why not be the first?</p>
          </Jumbotron>
        );
      }
    } else if (isFetching) {
      content = <Spinner size="lg" />;
    } else if (error) {
      content = (
        <Alert color="danger">
          <h4 className="alert-heading">Failed to fetch songsInQueue</h4>
          <p>{error}. <a onClick={this.getPlayerQueue}>Click here</a> to try again.</p>
        </Alert>
      );
    }

    return (
      <>
        <h2>PlayerQueue</h2>
        <div className="tracks tracks--queue">
          {content}
        </div>
      </>
    );
  }

  private getPlayerQueue = async () => {
    //const {artistName}  = this.state;
    const headers = {Authorization: "Bearer "+window.localStorage.getItem("access_token")}
    console.log("adding song to queue: ****** getPlayerQueue *******");
            
            
            axios.get("https://api.spotify.com/v1/me/player/queue", {headers}).then(res=> {
                console.log("SUCCESS!!!! --> axio.post call https://api.spotify.com/v1/me/player/queue ", res);
                //window.location.reload();
                this.setState({songsInQueue:res.data.queue});

            }).catch(err =>{
                console.log("FAIL!!!! --> axio.post call https://api.spotify.com/v1/me/player/queue ", err.message);
            });

            
}

}

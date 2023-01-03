import React from 'react';
import { Spinner, Card, CardTitle, CardBody, CardText, Alert, Jumbotron } from 'reactstrap';
import axios from 'axios';
import tokenRefresher from '../lib/tokenrefresher';

interface State {
  songCurrentlyPlaying: null;
  isFetching: boolean;
  error: null | string;
  
}

export default class SongCurrentlyPlaying extends React.Component<{}, State> {
  state: State = {
    songCurrentlyPlaying: null,
    isFetching: false,
    error: null
  };

  // As soon as this component mounts, start fetching songCurrentlyPlaying
  componentDidMount() {
    this.getSongCurrentlyPlaying();
  }

  render() {
    const { songCurrentlyPlaying, isFetching, error } = this.state;

    let content;
    if (songCurrentlyPlaying) {
      if (songCurrentlyPlaying.item) {
        
        content = (
          <div className='track' key={songCurrentlyPlaying.item.id} >
              <div className="track_art">
                  <img className='pull-left'  height={songCurrentlyPlaying.item.album.images[2].height} width={songCurrentlyPlaying.item.album.images[2].width} src={songCurrentlyPlaying.item.album.images[2].url}  />
                  
              </div>  
              <div className="track__title"><p>{songCurrentlyPlaying.item.name}</p><p>{songCurrentlyPlaying.item.album.artists[0].name}</p></div>
          </div>
          
          

        );
      } else {
        content = (
          <Jumbotron>
            <h2 className="text-center">No songCurrentlyPlaying yet.</h2>
          </Jumbotron>
        );
      }
    } else if (isFetching) {
      content = <Spinner size="lg" />;
    } else if (error) {
      content = (
        <Alert color="danger">
          <h4 className="alert-heading">Failed to fetch songCurrentlyPlaying</h4>
          <p>{error}. <a onClick={this.getSongCurrentlyPlaying}>Click here</a> to try again.</p>
        </Alert>
      );
    }

    return (
      <>
        <h2>Now Playing</h2>
        <div className="tracks tracks--currentlyplaying">
          {content}
        </div>
      </>
    );
  }

  private getSongCurrentlyPlaying = async () => {
    //const {artistName}  = this.state;
    const headers = {Authorization: "Bearer "+window.localStorage.getItem("access_token")}
    console.log("adding song to queue: ****** getSongCurrentlyPlaying *******");
            
            
            axios.get("https://api.spotify.com/v1/me/player/currently-playing", {headers}).then(res=> {
                console.log("SUCCESS, GOT THE PLAYING SONG!!!! ", res.data);
                //window.location.reload();
                this.setState({songCurrentlyPlaying:res.data});

            }).catch(err =>{
                console.log("FAIL!!!! --> axio.post call https://api.spotify.com/v1/me/player/queue ", err.message, err.response.data.error.status);
                if(err.response.data.error.status == 401 ){
                  tokenRefresher.refreshAccessToken(window.localStorage.getItem("refresh_token"));
                  this.getSongCurrentlyPlaying();
                }
                
            });

            
}

}

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Spinner, Card, CardTitle, CardBody, CardText, Alert, Jumbotron } from 'reactstrap';
import axios from 'axios';
import api from 'lib/api';
import { SongRequest } from 'types';
import QRCode from 'react-qr-code';


import {
    CardHeader,
    Form,
    FormGroup,
    Input,
    Button, 
  } from 'reactstrap';

interface State {
  isFetching: boolean;
  error: null | string;
  token: null | string;
  hash:null | string;
  searchKey:null |string;
  setSearchKey:null;
  artists:null;
  setArtists:null;
  artistName: string;
  content: string;
  isPosting: boolean;
  pendingSongRequest: null | SongRequest;
  uriParams:null;
  searchResults:null;
  songUri:string;
  paymentRequest: null | string;
  back: string;
  fore: string;
  size: number;
}


export default class Spotify extends React.Component<{}, State> {
  state: State = {
    isFetching: false,
    error: null,
    token:"",
    hash:"",
    searchKey: "null",
    setSearchKey:null,
    artists:null,
    setArtists:null,
    artistName: '',
    content: '',
    isPosting: false,
    pendingSongRequest: null,
    uriParams: null,
    searchResults:null,
    songUri:'',
    paymentRequest:null,
    back: "#ffffff",
    fore: "#000000",
    size: 300
  };

  // Add a song to the que using the Spotify authorization token
  private addToQueue = async (e, songUri:string, songName:string, artistName:string, imageUrl:string) => {

    this.setState({
      isPosting: true,
      error: null,
    });
    const uriParams = {
        uri: songUri
    }
    
    
    

    api.submitSongRequest(artistName, songUri, imageUrl, songName)
      .then(res => {
        //console.log('submitSongRequest',res);
        this.setState({
          uriParams: uriParams,
          isPosting: false,
          pendingSongRequest: res.songRequest,
          paymentRequest: res.paymentRequest,
        });
        
        this.checkIfPaid();
      }).catch(err => {
        this.setState({
          isPosting: false,
          error: err.message,
        })
      });

    
}

  private searchArtists = async (e) => {
        const {artistName}  = this.state;
        console.log("searching artist with name: ", artistName);
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("access_token")}`
            },
            params: {
                q: artistName,
                type: "track"
            }
        })

        this.setState({searchResults:data.tracks.items});
    }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({ [ev.target.name]: ev.target.value } as any);
  };

  private cancelSongRequest=() => {
    window.location.reload();
  }

  render() {
    

    const { artistName,content,isPosting,uriParams,searchResults,paymentRequest, back,fore, size } = this.state;
    let {hash, token} = this.state;

    const {searchKey, setSearchKey} = this.state;
    let {artists} = this.state;

    let searchResultsContent;

    const disabled =  !artistName.length || isPosting;

    hash = window.location.hash;
    token = window.localStorage.getItem("token");
    
    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
        console.log('token', token);
    }


    let cardContent;
    if (paymentRequest) {
      cardContent = (
        <div>
        <div id="exampleModalLive" className="modal fade show"  role="dialog" aria-labelledby="exampleModalLiveLabel" aria-modal="true" >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLiveLabel">Lightning invoice</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={event => this.cancelSongRequest()}>
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                      <div className="modal-body d-flex justify-content-around">
                      <div className="PostForm-pay">
                        
                        <FormGroup>
                          <QRCode
                            value={paymentRequest}
                            bgColor={back}
                            fgColor={fore}
                            size={size}
                          />
                        </FormGroup>
                        <div className="d-none">
                          <FormGroup>
                            <Input
                              value={paymentRequest}
                              type="textarea"
                              rows="1"
                              disabled
                            />
                          </FormGroup>
                        
                          <Button color="primary" block href={`lightning:${paymentRequest}`}>
                            Open in Wallet
                          </Button>
                        </div>
                      </div>
                      </div>
                      <div className="modal-footer d-flex justify-content-around">
                        <button type="button" className="btn btn-secondary"  data-dismiss="modal" onClick={event => this.cancelSongRequest()}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
        
        </div>
      );
    } else {
      cardContent =(<div></div>);
    }
    
    if(searchResults){
        searchResultsContent = searchResults.map(p => (
            <div className='track' key={p.id} onClick={event => this.addToQueue (event, p.uri,p.name,p.artists[0].name, p.album.images[2].url)}>
                <div className="track_art">
                    <img className='pull-left' height={p.album.images[2].height} width={p.album.images[2].height} src={p.album.images[2].url} />
                </div>
                <div className="track__added"><i className="ion-checkmark-round added"></i></div>
                <div className="track__title"><p>{p.name}</p><p>{p.artists[0].name}</p></div>
                <div className="track__plays">{new Date(p.duration_ms).toISOString().slice(11, 19)}</div>
            </div>
        ));
        
    }
    

    return (

        <div className="App">
            <header className="App-header">
                
                {
                    // invoice of songRequest
                    cardContent
                }
                
                <Form onSubmit={this.searchArtists}>
                <h2>Search a song or album:</h2>
                <Row className="justify-content-md-center">
                  <Col xs={12} sm={8}>
                    <FormGroup>
                        <Input
                        name="artistName"
                        value={artistName}
                        placeholder="Name"
                        onChange={e => this.setState({artistName:e.target.value})}
                        />
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Button color="primary" type="submit" block disabled={disabled}>
                        {isPosting ? (
                        <Spinner size="sm" />
                        ) : (
                        <>Search</>
                        )}
                    </Button>
                  </Col>
                  
                </Row>
                    
                    
                    
                </Form> 

                <>
                    <div className='tracks tracks--search'>
                    {searchResultsContent}
                    </div>
                </>

                
            </header>
        </div>
    );
  }

  

  // Check if they've paid their invoice after a delay. Check again if they
  // haven't paid yet. Reload the page if they have.
  private checkIfPaid = () => {
    setTimeout(() => {

      const { pendingSongRequest } = this.state;
      const {uriParams } = this.state;
      console.log("uriParams ======= ",uriParams);

      

      if (!pendingSongRequest) return;

      // When the request was payed, add the song to the playing queue and refresh the page

      api.getSongRequest(pendingSongRequest.id).then(p => {
        if (p.hasPaid) {
            const headers = {Authorization: "Bearer "+window.localStorage.getItem("access_token")}
            
            console.log("adding song to queue: ", uriParams.uri);
            axios.post("https://api.spotify.com/v1/me/player/queue"+"?uri="+encodeURI(uriParams.uri), uriParams, {headers}).then(res=> {
                console.log("SUCCESS!!!! --> axio.post call https://api.spotify.com/v1/me/player/queue ");
                window.location.reload();
            }).catch(err =>{
                console.log("FAIL!!!! --> axio.post call https://api.spotify.com/v1/me/player/queue ", err.message);
            });
            
          
        } else {
          this.checkIfPaid();
        }
      });
    }, 1000);
  };

  
}

import React from 'react';
import { Spinner, Card, CardTitle, CardBody, CardText, Alert, Jumbotron } from 'reactstrap';
import { Post } from 'types';
import axios from 'axios';
import time from 'lib/time';
import env from './env';
import api from 'lib/api';
import QRCode from 'react-qr-code';


import {
    CardHeader,
    Form,
    FormGroup,
    Input,
    Button, 
  } from 'reactstrap';

interface State {
  CLIENT_ID: string;
  REDIRECT_URI: string;
  AUTH_ENDPOINT: string;
  RESPONSE_TYPE: string;
  PERMISSIONSCOPE_SPOTIFY:string;
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
  pendingPost: null | Post;
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
    CLIENT_ID : "52f4c5a24ece4a929538e2f6ef1bc95b",
    REDIRECT_URI : "http://localhost:3000",
    AUTH_ENDPOINT : "https://accounts.spotify.com/authorize",
    RESPONSE_TYPE : "token",
    PERMISSIONSCOPE_SPOTIFY:"user-modify-playback-state",
    token:"",
    hash:"",
    searchKey: "null",
    setSearchKey:null,
    artists:null,
    setArtists:null,
    artistName: '',
    content: '',
    isPosting: false,
    pendingPost: null,
    searchResults:null,
    songUri:'',
    paymentRequest:null,
    back: "#ffffff",
    fore: "#000000",
    size: 300
  };

  // Add a song to the que using the Spotify authorization token
  private addToQueue = async (e, songUri:string) => {

    //const { name, content } = this.state;
    const name = "requested song";
    const content = songUri;

    this.setState({
      isPosting: true,
      error: null,
    });
    const params = {
        uri: songUri
    }
    
    const headers = {Authorization: "Bearer "+window.localStorage.getItem("token")}
    console.log("adding song to queue: ", songUri);
    const {data} = await axios.post("https://api.spotify.com/v1/me/player/queue"+"?uri="+encodeURI(params.uri), 
        params,
        {headers});

    api.submitSongRequest(name, content)
      .then(res => {
        this.setState({
          isPosting: false,
          pendingPost: res.post,
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
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
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

  render() {
    

    const { CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, RESPONSE_TYPE,PERMISSIONSCOPE_SPOTIFY,artistName,content,isPosting,searchResults,paymentRequest, back,fore, size } = this.state;
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
        <div className="PostForm-pay">
          <FormGroup>
            <Input
              value={paymentRequest}
              type="textarea"
              rows="5"
              disabled
            />
          </FormGroup>
          <FormGroup>
            <QRCode
              value={paymentRequest}
              bgColor={back}
              fgColor={fore}
              size={size}
            />
          </FormGroup>
        
          <Button color="primary" block href={`lightning:${paymentRequest}`}>
            Open in Wallet
          </Button>
        </div>
      );
    } else {
      cardContent =(<div></div>);
    }
    

    const logout = () => {
        token = "";
        window.localStorage.removeItem("token");
        console.log("logout - value token",token);
    }
    if(searchResults){
        searchResultsContent = searchResults.map(p => (
            <div className='track' key={p.id} onClick={event => this.addToQueue (event, p.uri)}>
                <div className="track_art">
                    <img className='pull-left' height={p.album.images[2].height} width={p.album.images[2].height} src={p.album.images[2].url} />
                </div>
                <div className="track__number">1</div>  
                <div className="track__added"><i className="ion-checkmark-round added"></i></div>
                <div className="track__title">{p.name} - {p.artists[0].name}</div>
                <div className="track__explicit"><span className="label">Explicit</span></div>
                <div className="track__plays">{new Date(p.duration_ms).toISOString().slice(11, 19)}</div>
            </div>
        ));
        
    }
    

    return (

        <div className="App">
            <header className="App-header">
                {(!token || token =="")  ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${PERMISSIONSCOPE_SPOTIFY}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <Button onClick={logout}>Logout</Button>
                }
                
                {
                    // invoice of songRequest
                    cardContent
                }
                
                <Form onSubmit={this.searchArtists}>
                    <FormGroup>
                        <Input
                        name="artistName"
                        value={artistName}
                        placeholder="Name"
                        onChange={e => this.setState({artistName:e.target.value})}
                        />
                    </FormGroup>

                    <Button color="primary" size="lg" type="submit" block disabled={disabled}>
                        {isPosting ? (
                        <Spinner size="sm" />
                        ) : (
                        <>Search Artists {artistName.length > 0 ? "\""+artistName+"\"" : ""}</>
                        )}
                    </Button>
                </Form> 

                <>
                    <h2>Search Results</h2>
                    <div className='tracks'>
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
      const { pendingPost } = this.state;
      if (!pendingPost) return;

      api.getPost(pendingPost.id).then(p => {
        if (p.hasPaid) {
          window.location.reload();
        } else {
          this.checkIfPaid();
        }
      });
    }, 1000);
  };

  
}

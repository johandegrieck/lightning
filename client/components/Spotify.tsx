import React from 'react';
import { Spinner, Card, CardTitle, CardBody, CardText, Alert, Jumbotron } from 'reactstrap';
import { Post } from 'types';
import api from 'lib/api';
import axios from 'axios';

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
}


export default class Spotify extends React.Component<{}, State> {
  state: State = {
    isFetching: false,
    error: null,
    CLIENT_ID : "52f4c5a24ece4a929538e2f6ef1bc95b",
    REDIRECT_URI : "http://localhost:3000",
    AUTH_ENDPOINT : "https://accounts.spotify.com/authorize",
    RESPONSE_TYPE : "token",
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
    songUri:'spotify:track:2fV9z65hwYlvX8hYtbEQIZ',
  };
  private setSongUri = (uri) => {
    this.setState({songUri:uri});
    console.log('uri was set with', uri);
  }

  private addToQueue = async (e) => {
    console.log('adding to Queueu --------- ', window.localStorage.getItem("token"));
    const {songUri}  = this.state;
    const params = {
        uri: 'spotify:track:03MOcbkkoNLjP0G91iODSB'
    }
    const headers = {Authorization: "Bearer BQAxWime1_dro60-QUe-h7zhTOuwrkzNfdKqJ2slS55EyQkmU0CcE56vkPSYGDwKaHIftcVUtmM8z9Zby1GRrYOUBBRonNh6qj3ajLPpKzeMEXufAXtgMeGdMO1SQ_hQ8WMelnzD18Kmjz2AgxqYtwkCGD1yAPi81jbjkZRuY_yJXWEO-ILUe4vWqU6IZL__46fjsQVmG77jyU73YaMzs4SVjxjKdcukZ25WbnB_aZKuQUoweG_4jAltLD7E6BoOyIM2uV9fgjMvyFds7eio_zM"}
    
    console.log("adding song to queue: ", songUri);
    const {data} = await axios.post("https://api.spotify.com/v1/me/player/queue"+"?uri="+encodeURI(params.uri), 
        params,
        {headers})

    //this.setState({searchResults:data.tracks.items});
    console.log("song added !!! ", data);
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
    

    const { CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, RESPONSE_TYPE,artistName,content,isPosting,searchResults } = this.state;
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

    

    const logout = () => {
        token = "";
        window.localStorage.removeItem("token");
        console.log("logout - value token",token);
    }
    if(searchResults){
        searchResultsContent = searchResults.map(p => (
        
            <Button key={p.id} onClick={
                    this.addToQueue 
            }>Add "{p.name}" to queue</Button>
        ));
        
    }
    

    return (

        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {(!token || token =="")  ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <Button onClick={logout}>Logout</Button>
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
                    {searchResultsContent}
                </>

                
            </header>
        </div>
    );
  }

  
}

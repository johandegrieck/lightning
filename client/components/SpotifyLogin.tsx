import React from 'react';
import axios from 'axios';

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
  code: null | string;
  token: null | string;
  hash:null | string;
}


export default class Spotify extends React.Component<{}, State> {
  state: State = {
    isFetching: false,
    error: null,
    code:"",
    token:"",
    hash:"",
  };


  private getAccessToken = async () => {
    //const {artistName}  = this.state;
    //const headers = {Authorization: "Bearer "+window.localStorage.getItem("token")}
    const headers = {
      'content-type':'application/x-www-form-urlencoded',
      Authorization: `Basic  ${new Buffer.from(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`).toString('base64')}`
    }

    const dataParams = {
          grant_type: 'authorization_code',
          code: window.localStorage.getItem("code"),
          redirect_uri: process.env.REACT_APP_REDIRECT_URI
    }
            
            
    axios.post("https://accounts.spotify.com/api/token",dataParams , {headers}).then(res=> {
        console.log("SUCCESS GOT A NEW TOKEN !!!! --> axio.post call https://accounts.spotify.com/api/token ", res.data);
        window.localStorage.setItem("access_token", res.data.access_token);
        window.localStorage.setItem("refresh_token", res.data.refresh_token);
        window.localStorage.setItem("code","");

        window.location.replace(`${process.env.REACT_APP_REDIRECT_URI}`);
        //this.setState({songCurrentlyPlaying:res.data});

    }).catch(err =>{
        console.log("FAIL!!!! --> axio.post call https://accounts.spotify.com/api/token ", err.message);
        window.localStorage.setItem("code","");
        //window.location.reload();
    });

              
  }
  
  
  render() {
    let {hash, code} = this.state;

    hash = window.location.search;
    code = window.localStorage.getItem("code");
    
    if (!code && hash) {
        code = hash.substring(1).split("&").find(elem => elem.startsWith("code")).split("=")[1];
        window.localStorage.setItem("code", code);  
        console.log('got code from query string :', code);
        this.getAccessToken();
    }

    const logout = () => {
        code = "";
        window.localStorage.setItem("code", "");
        window.localStorage.setItem("access_token","");
        window.localStorage.setItem("refresh_token","");
        window.location.replace(`${process.env.REACT_APP_REDIRECT_URI}`);
    }
    
    return (

      <div className="float-left">
          {(!window.localStorage.getItem("refresh_token"))  ?
              // https://accounts.spotify.com/authorize?response_type=code&client_id=$CLIENT_ID&scope=$SCOPE&redirect_uri=$REDIRECT_URI
              <a href={`${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=${process.env.REACT_APP_PERMISSIONSCOPE_SPOTIFY}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`}>
                <Button> Login to Spotify</Button>
              </a>
              : <Button onClick={logout}>Logout</Button>
          }
          
      </div>
        
    );
  }

  

  
}

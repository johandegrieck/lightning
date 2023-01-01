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
  token: null | string;
  hash:null | string;
}


export default class Spotify extends React.Component<{}, State> {
  state: State = {
    isFetching: false,
    error: null,
    token:"",
    hash:"",
  };
  
  render() {
    let {hash, token} = this.state;

    hash = window.location.hash;
    console.log("hash ------", hash);
    console.log("location ------", window.location);
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
        window.location.reload();
    }
    
    
    

    return (

      <div className="float-left">
          {(!token || token =="")  ?
              // https://accounts.spotify.com/authorize?response_type=code&client_id=$CLIENT_ID&scope=$SCOPE&redirect_uri=$REDIRECT_URI
              <a href={`${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=${process.env.REACT_APP_PERMISSIONSCOPE_SPOTIFY}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`}>Login
                  to Spotify</a>
              : <Button onClick={logout}>Logout</Button>
          }
          
      </div>
        
    );
  }

  

  
}

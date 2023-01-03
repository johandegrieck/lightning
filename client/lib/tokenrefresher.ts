import axios from 'axios';

const headers = {
  'content-type':'application/x-www-form-urlencoded',
  Authorization: `Basic  ${new Buffer.from(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`).toString('base64')}`
}

const dataParams = {
      grant_type: 'refresh_token',
      refresh_token: window.localStorage.getItem("refresh_token")
}


const tokenRefresher = {
  refreshAccessToken: function(refreshToken) {
      axios.post("https://accounts.spotify.com/api/token",dataParams , {headers}).then(res=> {
        console.log("SUCCESS GOT A NEW ACCESS AND REFRESH TOKEN !!!! --> axio.post call https://accounts.spotify.com/api/token ", res.data);
        window.localStorage.setItem("access_token", res.data.access_token);
        window.localStorage.setItem("refresh_token", res.data.refresh_token);

    }).catch(err =>{
        console.log("FAIL!!!! --> axio.post call https://accounts.spotify.com/api/token ", err.message, " *_*_*_*_*_*_*_*_*_*_______ ACCESS AND REFRESH TOKEN WIPED");
        window.localStorage.setItem("code","");
        window.localStorage.setItem("access_token", "");
        window.localStorage.setItem("refresh_token", "");
        //window.location.reload();
    });
      //inspect the value
  }
};

export default tokenRefresher;
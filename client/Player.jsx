import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import * as SC from 'soundcloud';
import { createContainer } from 'meteor/react-meteor-data';
import {Songs} from '../lib/collections/SongCollection.js';
import {RadioPlayer} from '../lib/collections/RadioPlayer.js';
import Song from './Song';

class Player extends Component {

  constructor(props){
    super(props);

    this.state = {
      player: null,
      title: "",
      artist: ""

    };
  }

  addSong(e){
    e.preventDefault();
    const track_url = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    if(track_url){
      SC.resolve(track_url).then(function(track){
        Meteor.call("songs.insert", track);

      }).catch(function(error){
        alert('Invalid! ' + error);
      });
    }
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  renderRequests(){
    let rp = this.props.rp;
    if(rp){
      let reqSongs = rp.songReqList;
      if(reqSongs.length > 0){
        return reqSongs.map((sid) => (
          <Song key={sid} songId={sid} playerId={this.props.radioPlayerId} requestable={false} removeable={false}/>
        ));
      }
    }

  }

  renderSongs(){

    return this.props.songs.map((song) => (
      <Song key={song._id} songId={song._id} playerId={this.props.radioPlayerId} requestable={true} removeable={true}/>
    ));
  }

  setPlayer(e){
    Meteor.subscribe("songs");
    //let t = this.props.songs[0];
    let rp = this.props.rp;

    if(rp){
      var self = this;
      let songReq = rp.songReqList[0];
      if(songReq && (! rp.currentSong || self.state.player == null || (rp.currentSong != songReq))){

        let s = Songs.findOne({_id:songReq});
        if(s){
          Meteor.call("radioplayer.setCurrentSong", rp._id, s._id);

          let trackToPlay = s.track;
          SC.stream('/tracks/' + trackToPlay.id).then(function(p){
            self.setState({
              player : p,
              title :  trackToPlay.title,
              artist: trackToPlay.user.username
            });

          //  p.setVolume(0);
          //  p.play();
            p.on('finish', function(e){
              Meteor.call("radioplayer.removeReqSong", rp._id,s._id);
              Meteor.call("radioplayer.setCurrentSong", rp._id, null);
              if(self.state.title != ""){
                self.setState({  title : ""  });
              }

              if(self.state.artist != ""){
                self.setState({ artist: ""});
              }

            });
          });
        }else{
          Meteor.call("radioplayer.removeReqSong", rp._id,songReq);
          Meteor.call("radioplayer.setCurrentSong", rp._id, null);

          if(self.state.title != ""){

            self.setState({
              title : ""
            });
          }

          if(self.state.artist != ""){
            self.setState({
              artist: ""
            });
          }
        }
      }

    }
  }

  play(e){
    let p = this.state.player;
    if(p){
      p.play();
      p.setVolume(1);
    }
  }

  pause(e){
    let p = this.state.player;
    if (p){
      p.pause();
      p.setVolume(0);
    }
  }

  skip(e){
    let p = this.state.player;
    if (p){
      p.seek(p.streamInfo.duration);
    }
  }

  render(){
    return(

      <div className=".radio row">
        <div id="player" className="col-sm-5">
            {this.setPlayer()}
          <h3>Title: {this.state.title}</h3>
          <h3>Artist: {this.state.artist}</h3>
          <button onClick={this.play.bind(this)}>Play</button>
          <button onClick={this.pause.bind(this)}>Pause</button>
          <button onClick={this.skip.bind(this)}>Skip</button>
          <br/>
          Requested Songs
          <ul>
            {this.renderRequests()}
          </ul>
        </div>
        <br/>
        <div className="col-sm-6">
          <form className="new-song" onSubmit={this.addSong.bind(this)}>
            <input type="text" ref="textInput" />
            <button type='submit'>Add new song</button>
          </form>


          <br/>
          All songs
          <ul>
            {this.renderSongs()}
          </ul>
        </div>
      </div>

    );
  }
}

RadioPlayer.propTypes = {
  radioPlayerId : PropTypes.any.isRequired
}

export default createContainer(({params})=>{

  Meteor.subscribe("songs");
  Meteor.subscribe("radioplayer");
  return{
    songs: Songs.find({}, {sort: {addedOn:1}}).fetch(),
    rp: RadioPlayer.findOne({_id:params.radioPlayerId})
  };

}, Player);

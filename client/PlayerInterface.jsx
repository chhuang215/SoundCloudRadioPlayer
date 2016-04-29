import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import * as SC from 'soundcloud';
import { createContainer } from 'meteor/react-meteor-data';
import {Songs} from '/lib/collections/SongCollection.js';
import {RadioPlayer} from '/lib/collections/RadioPlayer.js';
import Song from './Song';
import Player from './Player'

export default class PlayerInterface extends Component {

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
    let rp = this.props.radioPlayer;
    if(rp){
      let reqSongs = rp.songReqList;
      if(reqSongs.length > 0){
        return reqSongs.map((sid) => (
          <Song key={sid} songId={sid} playerId={this.props.radioPlayer._id} requestable={false} removeable={false}/>
        ));
      }
    }

  }

  renderSongs(){

    return this.props.songs.map((song) => (
      <Song key={song._id} songId={song._id} playerId={this.props.radioPlayer._id} requestable={true} removeable={true}/>
    ));
  }

  setPlayer(e){
    Meteor.subscribe("songs");
    //let t = this.props.songs[0];
    let rp = this.props.radioPlayer;

    if(rp){
      var self = this;
      let songReq = rp.songReqList[0];
      if(songReq && (! rp.currentSong || self.state.player == null || (rp.currentSong != songReq))){

        let s = Songs.findOne({_id:songReq});
        if(s){
          Meteor.call("radioplayer.setCurrentSong", rp._id, s._id);

          let trackToPlay = s.track;
          SC.stream('/tracks/' + trackToPlay.id).then(function(p){
            p.seek(0);
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

  render(){
    return(

      <div className=".radio row">
        <div id="player" className="col-sm-5">
            {this.setPlayer()}
            <Player player={this.state.player} title={this.state.title} artist={this.state.artist} />

          <br/>
          Requested Songs
          <ul>
            {this.renderRequests()}
          </ul>
        </div>
        <br/>
        <div className="col-sm-6">
          <form className="form-inline" onSubmit={this.addSong.bind(this)}>
            <div className="input-group">

              <input className="form-control"  type="text" ref="textInput" />
                <span className="input-group-btn">
                  <button className="btn btn-default" type='submit'>Add new song</button>
                </span>
            </div>

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

PlayerInterface.propTypes = {
  radioPlayer : PropTypes.any.isRequired,
  songs: PropTypes.array
}

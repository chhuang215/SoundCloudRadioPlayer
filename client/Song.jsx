import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Songs} from '/lib/collections/SongCollection.js';


// Task component - represents a single todo item
export default class Song extends Component {
  constructor(props){
    super(props);

    Meteor.subscribe("songs");
    var s = Songs.findOne({_id:this.props.songId});
    this.state = {
      songData: s,
    };

  }

  btnRequest(){
    if(this.props.requestable){
      return (<button className="btn btn-success btn-sm" onClick={this.requestThisSong.bind(this)}> Req </button>)
    }

  }

  btnRemove(){
    if(this.props.removeable){
      return(<button className="btn btn-danger btn-sm" onClick={this.removeThisSong.bind(this)}> &times;  </button>)
    }

  }

  removeThisSong(){
    Meteor.call('songs.remove', this.state.songData._id);
  }
  requestThisSong(){
    Meteor.call('radioplayer.addReqSong', this.props.playerId,  this.state.songData._id);
  }

  render() {
    return (

      <li>
        {this.btnRequest()}
        {this.btnRemove()}
            {this.state.songData.track.title} - {this.state.songData.track.user.username}
      </li>
    );
  }
}

Song.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  //song: PropTypes.object.isRequired,
  playerId: PropTypes.any
};

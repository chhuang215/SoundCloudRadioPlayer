import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import * as SC from 'soundcloud';
import { createContainer } from 'meteor/react-meteor-data';
import {Songs} from '/lib/collections/SongCollection.js';
import {RadioPlayer} from '/lib/collections/RadioPlayer.js';

export default class Player extends Component{

  play(e){
    let p = this.props.player;
    if(p){
      p.play();
      p.setVolume(1);
    }
  }

  pause(e){
    let p = this.props.player;
    if (p){
      p.pause();
      p.setVolume(0);
    }
  }

  skip(e){
    let p = this.props.player;
    if (p){
      p.seek(p.streamInfo.duration);
    }
  }

  render(){
    return(
      <div>
        <h3>Title: {this.props.title}</h3>
        <h3>Artist: {this.props.artist}</h3>
        <button className="btn" onClick={this.play.bind(this)}>Play</button>
        <button className="btn" onClick={this.pause.bind(this)}>Pause</button>
        <button className="btn" onClick={this.skip.bind(this)}>Skip</button>
      </div>

    )
  }
}

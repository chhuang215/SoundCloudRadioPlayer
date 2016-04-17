import { Meteor } from 'meteor/meteor';
import {RadioPlayer} from '../lib/collections/RadioPlayer.js';
import {Songs} from '../lib/collections/SongCollection.js';
Meteor.startup(() => {

  if(!RadioPlayer.findOne()){
    RadioPlayer.insert({
      time:0,
      volume: 1.0,
      currentSong:null,
      songReqList:[],
      addedOn : new Date()
    });
  }
});

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const RadioPlayer = new Mongo.Collection('radioplayer');


if(Meteor.isServer){
  Meteor.publish("radioplayer", function(){
    return RadioPlayer.find();
  });

}

Meteor.methods({
  'radioplayer.insert':function(){
     RadioPlayer.insert({
       time:0,
       volume: 1.0,
       currentSong:null,
       songReqList:[],
       addedOn : new Date()
     });
  },
  'radioplayer.setCurrentSong':function(id,song){
     RadioPlayer.update({_id:id}, {$set:{currentSong:song}});
  },

  'radioplayer.addReqSong':function(id,songId){
      let r = RadioPlayer.findOne({_id:id});
      if(r){
        let reqList = r.songReqList;
        if(reqList.indexOf(songId) == -1){
            reqList.push(songId);
            RadioPlayer.update({_id:id}, {$set:{songReqList:reqList}});
        }
      }
  },
  'radioplayer.removeReqSong':function(id,songId){
      let r = RadioPlayer.findOne({_id:id});
      if(r){
        let reqList = r.songReqList;
        let index = reqList.indexOf(songId);
        if(index != -1){
            reqList.splice(index,1);
            RadioPlayer.update({_id:id}, {$set:{songReqList:reqList}});
        }
      }
  },
  'radioplayer.remove':function(id){
     RadioPlayer.remove({
       _id:id
     });
  }
});

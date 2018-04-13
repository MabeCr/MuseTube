import { Component, OnInit } from '@angular/core';
import { UrlService } from './../services/url/url.service';
import { Song } from './../shared/song';
import { SONGS } from './../shared/saved-songs';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent implements OnInit {

  public videoID = '';
  public player: any;
  public YT: any;

  songs = SONGS;

  currentSongIndex: number;
  currentSong: Song;

  loadable: boolean;

  constructor(private urlService: UrlService) {
  }

  init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  ngOnInit() {
    this.init();
    this.videoID = '' //video id

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.player = new window['YT'].Player('player', {
        videoId: this.videoID,
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onReady': (e) => {
            this.loadable = true;
            this.changeSong(0);
          }
        }
      });
    };
  }

  onPlayerStateChange(event) {
    // console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        this.loadable = true;
        // if (this.cleanTime() == 0) {
        //   console.log('started ' + this.cleanTime());
        // } else {
        //   console.log('playing ' + this.cleanTime())
        // };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          // console.log('paused' + ' @ ' + this.cleanTime());
        };
        break;
      case window['YT'].PlayerState.ENDED:
        this.changeSong(this.currentSongIndex + 1);
        break;
    };
  }

  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  }

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.videoID)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  }

  changeSong(index: number) {
    if (this.loadable === true) {
      this.loadable = false;
      if (index > this.songs.length - 1) {
        index = 0;
      }
      console.log(index);
      this.currentSongIndex = index;
      this.currentSong = this.songs[index];
      let newVideoID = this.currentSong.videoID;
      let newStartTime = this.currentSong.startTime;
      let newEndTime = this.currentSong.endTime;
      this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime, 'endSeconds': newEndTime });
    }
  }

}

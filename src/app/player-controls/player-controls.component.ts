import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, NgZone } from '@angular/core';
import { Song } from './../shared/song';
import { SongLibraryComponent } from '../song-library/song-library.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent implements OnInit, OnChanges {
  @Input() currentSongIndex: number = 0;
  @Input() songs: Song[] = [];
  @Input() searchResults: Song[] = [];
  @Output() songChanged = new EventEmitter<number>();

  public videoID = '';
  public player: any;
  public YT: any;
  statusString = 'Loading';
  isPlayerLoaded = false;
  private hasLoadedSongStarted = false;

  private shuffle: boolean = false;

  constructor(private titleService: Title, private zone: NgZone) {
  }

  get currentSong(): Song {
    return this.songs[this.currentSongIndex];
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
        height: 250,
        width: 300,
        playerVars: { 'controls': 1, 'modestbranding': 1, 'rel': 0, 'showinfo': 0 },
        events: {
          'onStateChange': (e) => {
            this.zone.run(() => {
              this.onPlayerStateChange(e)
            });
          },
          'onError': this.onPlayerError.bind(this),
          'onReady': (e) => {
            this.zone.run(() => {
              this.isPlayerLoaded = true;
              this.player.setVolume(60);
              this.loadSong(this.currentSong);
            }
            );
          }
        }
      });
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    //If the current song index changed, play new song.
    if (this.isPlayerLoaded && changes.currentSongIndex) {
      let newSongIndex = changes.currentSongIndex.currentValue as number;
      let currentSong: Song;
      currentSong = this.songs[newSongIndex];
      this.loadSong(currentSong);
    }
  }

  onPlayerStateChange(event) {
    // console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        //console.log("PLAYING");
        this.statusString = 'Playing';
        this.hasLoadedSongStarted = true;
        // if (this.cleanTime() == 0) {
        //   console.log('started ' + this.cleanTime());
        // } else {
        //   console.log('playing ' + this.cleanTime())
        // };
        this.titleService.setTitle(this.currentSong.title + ' - ' + this.currentSong.artist);
        break;
      case window['YT'].PlayerState.PAUSED:
        //console.log("PAUSED");
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          // console.log('paused' + ' @ ' + this.cleanTime());

        };
        this.statusString = 'Paused';
        this.titleService.setTitle('Paused: ' + this.currentSong.title + ' - ' + this.currentSong.artist);
        break;
      case window['YT'].PlayerState.ENDED:
        //console.log("ENDED");
        //Workaround strange bug when video ends at manual end time, calls ENDED twice.
        //Only load next song once current song has started.
        if (this.hasLoadedSongStarted) {
          this.onPlayNext();
        }
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

  private loadSong(newSong: Song) {
    if (newSong) {
      this.hasLoadedSongStarted = false;
      let newVideoID = newSong.videoID;
      let newStartTime = newSong.startTime;
      let newEndTime = newSong.endTime;
      this.titleService.setTitle(this.currentSong.title + ' - ' + this.currentSong.artist);
      if (newStartTime === null && newEndTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID });
      } else if (newStartTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID, 'endSeconds': newEndTime });
      } else if (newEndTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime });
      } else {
        this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime, 'endSeconds': newEndTime });
      }
    }
  }

  onPlayPrevious() {
    let newIndex: number;
    let currentSong = this.songs[this.currentSongIndex];
    if (this.searchResults.length > 0) {
      for (let i = 0; i < this.searchResults.length; i++) {
        let tempSong = this.searchResults[i];
        if (tempSong.songID === currentSong.songID) {
          if (i == 0) {
            newIndex = this.searchResults[this.searchResults.length - 1].songID;
          } else {
            newIndex = this.searchResults[i - 1].songID;
          }
        }
      }
    } else {
      newIndex = this.currentSongIndex - 1;
    }
    this.songChanged.emit(newIndex);
  }

  onPlayNext() {
    let newIndex: number;
    if (this.shuffle) {
      if (this.searchResults.length > 0) {
        newIndex = Math.random() * (this.searchResults.length - 1);
      } else {
        newIndex = Math.random() * (this.songs.length - 1);
      }
      if (newIndex === this.currentSongIndex) {
        newIndex = newIndex + 1;
      }
      newIndex = Math.floor(newIndex);
    } else {
      let currentSong = this.songs[this.currentSongIndex];
      if (this.searchResults.length > 0) {
        for (let i = 0; i < this.searchResults.length; i++) {
          let tempSong = this.searchResults[i];
          if (tempSong.songID === currentSong.songID) {
            if (i == this.searchResults.length - 1) {
              newIndex = this.searchResults[0].songID;
            } else {
              newIndex = this.searchResults[i + 1].songID;
            }
          }
        }
      } else {
        newIndex = this.currentSongIndex + 1;
      }
      this.songChanged.emit(newIndex);
    }
  }

  onPlayPause() {
    if (this.player.getPlayerState() == 1) { //playing
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  onVolumeUp() {
    let currentVolume = this.player.getVolume();
    if (currentVolume < 100) {
      this.player.setVolume(currentVolume + 10);
    }
  }

  onVolumeDown() {
    let currentVolume = this.player.getVolume();
    if (currentVolume > 0) {
      this.player.setVolume(currentVolume - 10);
    }
  }

  onToggleShuffle() {
    this.shuffle = !this.shuffle;
  }

  getString() {
    if (this.statusString === 'Paused') {
      return 'Play'; //Reverse the current state to that the button reflects the correct action
    } else {
      return 'Pause'; //Set it to pause automatically as the default on load
    }
  }

}
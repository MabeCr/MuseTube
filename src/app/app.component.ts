import { Component } from '@angular/core';
import { Song } from './shared/song';
import { SONGS } from './shared/saved-songs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MuseTube';
  currentSongIndex = 0;
  songs: Song[] = SONGS;
  searchResults: Song[] = [];

  onSongChanged(newSongIndex: number) {
    this.currentSongIndex = newSongIndex;
  }

  onSearchRequested(searchString: string) {
    if (searchString === '') {
      let currentSong = this.searchResults[this.currentSongIndex];
      for (let i = 0; i < this.songs.length; i++) {
        let tempSong = this.songs[i];
        if (tempSong.title === currentSong.title && tempSong.artist === currentSong.artist) {
          this.currentSongIndex = i;
        }
      }
      this.searchResults = []; //clear the current search results
    } else {
      this.searchResults = []; //clear the current search results
      for (let i = 0; i < this.songs.length; i++) {
        let tempSong = this.songs[i];
        if (tempSong.artist.toLowerCase().includes(searchString.toLowerCase())) {
          this.searchResults.push(tempSong);
        } else if (tempSong.album.toLowerCase().includes(searchString.toLowerCase())) {
          this.searchResults.push(tempSong);
        } else if (tempSong.title.toLowerCase().includes(searchString.toLowerCase())) {
          this.searchResults.push(tempSong);
        }
      }
    }
  }
}
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
    this.searchResults = []; //clear the current search results
    if (searchString !== '') {
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
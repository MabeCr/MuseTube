import { Component, OnInit } from '@angular/core';
import { Song } from './../shared/song';
import { SONGS } from './../shared/saved-songs';

@Component({
  selector: 'app-song-library',
  templateUrl: './song-library.component.html',
  styleUrls: ['./song-library.component.css']
})
export class SongLibraryComponent implements OnInit {

  songs: Song[] = SONGS;

  constructor() { }

  ngOnInit() {
  }

}

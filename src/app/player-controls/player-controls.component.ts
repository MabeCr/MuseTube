import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlService } from './../services/url/url.service';
import { Song } from './../shared/song';
import { SONGS } from './../shared/saved-songs';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent implements OnInit {

  videoURL = 's-HAsxt9pV4';
  songs = SONGS;
  sanitizedVideoURL;

  constructor(private sanitizer: DomSanitizer, private urlService: UrlService) {
  }

  ngOnInit() {
    this.sanitizedVideoURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(this.urlService.constructURL(this.videoURL, 297, 400));
  }

  changeSong(newVideoURL: string, newStartTime: number, newEndTime: number) {
    this.sanitizedVideoURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(this.urlService.constructURL(newVideoURL, newStartTime, newEndTime));
  }

}

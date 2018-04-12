import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {

  youtubeRoot = 'https://www.youtube.com/embed/';
  urlParameters = 'autoplay=1&fs=0&modestbranding=1&rel=0&showinfo=0';

  constructor() { }

  constructURL(videoID: string, startTime: number, endTime: number) {
    let constructedURL = this.youtubeRoot + videoID;
    if (startTime !== null && endTime !== null) {
      constructedURL = constructedURL +  
      '?start=' + startTime + 
      '&end=' + endTime +
      "&" + this.urlParameters;
    } else if (startTime !== null) {
      constructedURL = constructedURL +  
      '?start=' + startTime + 
      "&" + this.urlParameters;
    } else if (endTime !== null) {
      constructedURL = constructedURL +  
      '?end=' + endTime + 
      '&' + this.urlParameters;
    } else {
      constructedURL = constructedURL +
      '?' + this.urlParameters;
    }

    return constructedURL;
  }

}

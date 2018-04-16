import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongLibraryComponent } from './song-library.component';

describe('SongLibraryComponent', () => {
  let component: SongLibraryComponent;
  let fixture: ComponentFixture<SongLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

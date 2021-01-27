import { Component, OnInit } from '@angular/core';

import  isNil from 'lodash/isNil';

import { TvShowApi } from '../../models/tvShowApi.model';
import { TvShowsService } from './../../services/tvShows.service';
import { TvShow } from '../../models/tvShow.model';

import Images from '../../../assets/imagesUrl.json';
import Texts from '../../../assets/texts.json';
import WatchedStatus from '../../../assets/configs/watchedStatus.json'

import { UserTvShow } from './../../models/userTvShow.model';

@Component({
  selector: 'app-watching-tv-shows-form',
  templateUrl: './watching-tv-shows-form.component.html',
  styleUrls: ['./watching-tv-shows-form.component.css']
})
export class WatchingTvShowsFormComponent implements OnInit {
  images: any = Images;
  texts: any = Texts;
  watchedStatus: any = WatchedStatus;

  isLoading: boolean = true;

  tvShowApi: TvShowApi;
  tvShow: TvShow;
  watchingTvShow: UserTvShow = new UserTvShow();

  tvShowId: string;
  userId: any;

  validateForm: boolean = true;

  constructor(private tvShowsService: TvShowsService) { }

  ngOnInit(): void {
    this.tvShowId = localStorage.getItem('tvShowId');
    localStorage.removeItem('tvShowId');
    this.userId = localStorage.getItem('previousUrl');

    this.tvShowsService.getTvShow(this.tvShowId).subscribe(
      (newData) => {
        this.tvShowApi = newData;
        this.tvShow = this.tvShowApi.tvShow
        this.isLoading = false;
      }
    )
  }

    public saveWatchingTvShow(watchingTvShow: UserTvShow) {
      this.watchingTvShow.watchedStatus = this.watchedStatus.watching;
      this.watchingTvShow.userId =this.userId;
      console.log('this.watchingTvShow', this.watchingTvShow)
      console.log('this.tvShow', this.tvShow);
    // this.opinionService.postOpinion(this.opinion).subscribe(
    //   response => {
    //     swal.fire({
    //       background: 'rgb(211,211,211)',
    //       icon: 'success',
    //       title: 'Valoración enviada',
    //       text: 'Gracias por valorarnos'
    //     }),
    //     this.router.navigate(['/opinions']);
    //   },
    //   error => {
    //     swal.fire({
    //       background: 'rgb(211,211,211)',
    //       icon: 'error',
    //       title: 'Oops...',
    //       text: 'No se ha podido enviar la valoración'
    //     })
    //   }
    // )
  }

  public onSubmit(): void {
    if (isNil(this.watchingTvShow.seasonWatched) || isNil(this.watchingTvShow.episodeWatched)  ) {
      this.validateForm = false
    } else  {
      this.validateForm = true;
      this.saveWatchingTvShow(this.watchingTvShow);
    }
  }

}
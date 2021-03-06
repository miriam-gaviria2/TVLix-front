import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import  isNil from 'lodash/isNil';

import swal from'sweetalert2';

import { TvShowApi } from '../../models/tvShowApi.model';
import { TvShowDTO } from './../../models/tvShowDTO.model';
import { TvShowDetail } from '../../models/tvShowDetail.model';
import { UserTvShowDTO } from '../../models/userTvShowDTO.model';

import { TvShowsService } from './../../services/tvShows.service';
import { UserService } from 'src/app/services/user.service';
import { UserTvShowsService } from 'src/app/services/userTvShows.service';

import Images from '../../../assets/imagesUrl.json';
import Texts from '../../../assets/texts.json';
import WatchedStatus from '../../../assets/configs/watchedStatus.json';

@Component({
  selector: 'app-finished-tv-shows-form',
  templateUrl: './finished-tv-shows-form.component.html',
  styleUrls: ['./finished-tv-shows-form.component.css']
})
export class FinishedTvShowsFormComponent implements OnInit {
  images: any = Images;
  texts: any = Texts;
  watchedStatus: any = WatchedStatus;

  isLoading: boolean = true;
  isUserTvShowDB: boolean;
  tvShowApi: TvShowApi;
  tvShow: any;

  finishedTvShow: UserTvShowDTO = new UserTvShowDTO();
  finishedTvShows: UserTvShowDTO[];
  tvShowDTO: TvShowDTO = new TvShowDTO();
  tvShowId: string;
  userId: any;

  validateForm: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowsService: TvShowsService,
    private userService: UserService,
    private userTvShowsService: UserTvShowsService,
    ) { }

  ngOnInit(): void {
    this.tvShowId = this.route.snapshot.paramMap.get("tvShowId");
    this.userId = sessionStorage.getItem('userId');
    if (isNil(this.userId)) this.router.navigate(['/login']);

    this.isUserTvShow();
  }

  private isUserTvShow = () => {
    this.userTvShowsService.getUserTvShowsByStatus(this.userId, this.watchedStatus.finished).subscribe(
      (data) => {
        if (!isNil(data)) {
          this.finishedTvShows = data;
          let isUserTvShowDB = this.finishedTvShows.some(finishedTvShow => finishedTvShow.tvShow.id.toString() === this.tvShowId.toString());
          if (isUserTvShowDB) {
            swal.fire({
              background: 'rgb(211,211,211)',
              icon: 'error',
              title: 'Oops...',
              text: 'La serie ya está en tu lista de series vistas'
            }),
            this.router.navigate(['/finishedTvShows'])
          } else {
            this.getTvShowFromDDBB();
          }
        } else {
          this.getTvShowFromDDBB();
        }
        this.isLoading = false;
      }
    )
  }

  private getTvShowFromDDBB = () => {
    this.tvShowsService.getTvShowByIdDB(this.tvShowId).subscribe(
      (newData) => {
        !isNil(newData) ? this.tvShow = newData : this.getTvShowFromApi();
      }
    )
  }

  private getTvShowFromApi = () => {
    this.tvShowsService.getTvShowApi(this.tvShowId).subscribe(
      (newData) => {
        this.parseTvShowApi(newData.tvShow);
      }
    )
  }

  private parseTvShowApi = tvShowApi => {
    return(
    this.tvShow = {
      end_date: tvShowApi.end_date,
      episodes: tvShowApi.episodes.length - 1,
      // genre: tvShowApi.genres,
      id: tvShowApi.id,
      image: tvShowApi.image_path,
      name: tvShowApi.name,
      rating: tvShowApi.rating,
      rating_count: tvShowApi.raing_count,
      runTime: tvShowApi.runtime,
      seasons: tvShowApi.episodes[tvShowApi.episodes.length - 1].season,
      sinopsis: tvShowApi.description,
      start_date: tvShowApi.start_date,
      status: tvShowApi.status
    }
  )};

  public saveFinishedTvShow(finishedTvShow: UserTvShowDTO) {
    this.finishedTvShow.watchedStatus = this.watchedStatus.finished;
    this.userService.getUserById(this.userId).subscribe(
      response => {
        console.log('response', response)
        this.finishedTvShow.user = response;
      }
    )

    this.finishedTvShow.tvShow = this.tvShow;

    setTimeout (() => {
      this.userTvShowsService.postUserTvShow(this.finishedTvShow).subscribe(
        response => {
          swal.fire({
            background: 'rgb(211,211,211)',
            icon: 'success',
            title: 'Ok',
            text: 'Serie guardada en tu perfil'
          }),
          this.router.navigate(['/finishedTvShows']);
        },
        error => {
          swal.fire({
            background: 'rgb(211,211,211)',
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha podido guardar la serie'
          })
        }
      )
    }, 500);
  }

  public onSubmit(): void {
    if (isNil(this.finishedTvShow.rate) || isNil(this.finishedTvShow.opinion)) {
      this.validateForm = false
    } else  {
      this.validateForm = true;
      this.saveFinishedTvShow(this.finishedTvShow);
    }
  }
}

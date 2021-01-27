import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import isNil from 'lodash/isNil';

import swal from'sweetalert2';

import { User } from '../../../models/user.model'
import { UserService } from 'src/app/services/user.service';

import Texts from '../../../../assets/texts.json';
import GenreTvShows from '../../../../assets/configs/genreTvShows.json'
import TypeTvShows from '../../../../assets/configs/typeTvShows.json'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  texts: any = Texts;
  genreTvShows: any = GenreTvShows;
  typeTvShows: any = TypeTvShows;

  isLoading = true;
  newUser: boolean = false;
  previousUrl: string;
  user: User = new User();
  userEmpty: boolean = true;
  userName: string = 'cristina';
  userToUpdate: User = new User();
  validateEmail: boolean = true;
  validateForm: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('this.userEmpty', this.userEmpty)
    this.userToUpdate = JSON.parse(localStorage.getItem('userToUpdate'));
    console.log('this.userToUpdate', this.userToUpdate)
    this.previousUrl = localStorage.getItem('previousUrl');
    console.log('this.previousUrl', this.previousUrl)
    if(this.previousUrl ==='/user'){
      this.userEmpty= false;
      console.log('this.userEmpty', this.userEmpty)
    }

    this.loadUser(this.userName);
  }

  public loadUser (userName){
    this.userService.getUserByUserName(this.userName).subscribe(
      (data) => {
        this.user = data;
        this.isLoading = false;
        this.user.name = this.user.name.charAt(0).toUpperCase().concat(this.user.name.substring(1, this.user.name.length));
        this.user.surname = this.user.surname.charAt(0).toUpperCase().concat(this.user.surname.substring(1, this.user.surname.length));
        this.user.userName = this.user.userName.charAt(0).toUpperCase().concat(this.user.userName.substring(1, this.user.userName.length));
        this.user.location = this.user.location.charAt(0).toUpperCase().concat(this.user.location.substring(1, this.user.location.length));
        this.user.typeMedia = this.user.typeMedia.charAt(0).toUpperCase().concat(this.user.typeMedia.substring(1, this.user.typeMedia.length));
        this.user.genre = this.user.genre.charAt(0).toUpperCase().concat(this.user.genre.substring(1, this.user.genre.length));
      }
    )
  }

  public saveData(): void {
    if (isNil(this.user.name) || this.user.name === '' || isNil(this.user.surname) || this.user.surname === ''
        || isNil(this.user.email) || this.user.email === '' || isNil(this.user.password) || this.user.password === ''
        || isNil(this.user.userName) || this.user.userName === '' || isNil(this.user.location) || this.user.location === ''
        || isNil(this.user.typeMedia) || this.user.typeMedia === '' || isNil(this.user.genre) || this.user.genre === '') {
        this.validateForm= false
    } else if (!this.checkEmail(this.user.email)){
      this.validateEmail=false;
    } else  {
      this.validateForm= true;
      // if(something) {
      //   this.createAccount(this.user)
      // } else {
      //   this.updateAccount(this.user)
      // }

      this.updateAccount(this.user)
      // this.createAccount(this.user)
    }
  }

  private checkEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  private createAccount(user){
    console.log(this.user)
    this.userService.postUser(this.user).subscribe(
      response => {
        this.newUser = response;
        if(this.newUser){
          swal.fire({
            background: 'rgb(211,211,211)',
            icon: 'success',
            title: 'Cuenta creada'
        }),
        this.router.navigate(['/tvShows']);
        }  else {
          swal.fire({
            background: 'rgb(211,211,211)',
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha podido crear la cuenta porque este usuario ya existe'
          })
        }
      },
      error => {
        swal.fire({
          background: 'rgb(211,211,211)',
          icon: 'error',
          title: 'Oops...',
          text: 'No se ha podido crear la cuenta'
        })
      }
    );
  }

  private updateAccount(user){
    console.log(this.user)
    this.userService.updateUser(this.user).subscribe(
      response => {
        this.newUser = response;
        if(this.newUser){
          swal.fire({
            background: 'rgb(211,211,211)',
            icon: 'success',
            title: 'Datos cambiados'
        }),
        this.router.navigate(['/user']);
        }  else {
          swal.fire({
            background: 'rgb(211,211,211)',
            icon: 'error',
            title: 'Oops...',
            text: 'No ha habido cambios en la actualización'
          })
        }
      },
      error => {
        swal.fire({
          background: 'rgb(211,211,211)',
          icon: 'error',
          title: 'Oops...',
          text: 'No se han podido cambiar los datos'
        })
      }
    );
  }
}

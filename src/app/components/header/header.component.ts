import { Component, OnInit } from '@angular/core';

import Texts from '../../../assets/texts.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  texts: any = Texts;

  loggedUserId: string;
  loggedUserUserName: string;

  constructor() { }

  ngOnInit(): void {
  }
}

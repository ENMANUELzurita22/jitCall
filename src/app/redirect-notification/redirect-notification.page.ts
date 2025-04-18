import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-redirect-notification',
  templateUrl: './redirect-notification.page.html',
  styleUrls: ['./redirect-notification.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RedirectNotificationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

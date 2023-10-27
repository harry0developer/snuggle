import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AnimationLoader, AnimationOptions, provideLottieOptions } from 'ngx-lottie';
import { User } from 'src/app/models/models';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ROUTES, STORAGE } from 'src/app/utils/const';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader,
  ],
})
export class MatchPage implements OnInit{

  @Input() user: User;
  me: User;
  options: AnimationOptions = {    
    path: '/assets/animations/fireworks.json'  
  };  
  
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private firebaseService: FirebaseService) { }

  async ngOnInit() {
 
    await this.firebaseService.getCurrentUser().then((user: any) => {
      this.me = user;
    }).catch(err => {
      console.log(err);
    });
  }
 
  openChats() {}

  onAnimate(): void {    
    console.log("Animating...");  
  }

  continueSwipping() {
    return this.modalCtrl.dismiss(null, 'swipe');
  }

  startChatting() {
    this.modalCtrl.dismiss(null, ROUTES.CHAT);
    this.router.navigate([ROUTES.CHAT, this.user.uid, {user: JSON.stringify(this.user)}])
  
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  user: any;
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
    ) { }

  ngOnInit() {
    this.user = this.firebaseService.userData;
  }

  goLoginPage(){
    this.router.navigate(["/auth"]);
  }


  completeVerification() {
    
  }
}

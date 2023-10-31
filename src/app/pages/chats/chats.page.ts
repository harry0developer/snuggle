import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { Message, MessageBase, User } from 'src/app/models/models';
import { ChatService } from 'src/app/service/chat.service';
import { DataService } from 'src/app/service/data.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { LocationService } from 'src/app/service/location.service';
import { COLLECTION } from 'src/app/utils/const';
import Methods from 'src/app/utils/helper/funtions';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage implements OnInit {

  defaultImage = '../../../assets/default.jpg';

  currentUser: any;
  isLoading: boolean = true;

  matchedUsers: any[] = [];
  matches: any[] = [];
  users: any[] = [];
  activeChats: any[] = [];

  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
  constructor(
    private router: Router, 
    private firebaseService: FirebaseService,
    private auth: Auth,
    private locationService: LocationService,
    private chatService: ChatService,
    private dataService: DataService,
  ) {}

  async ngOnInit() {
    // this.currentUser = this.auth.currentUser;
    await this.getAllUsers();
  } 


  async getAllUsers() {
    this.isLoading = true;
    this.users = [];
    let matchList: User[] = [];
    await this.chatService.getData(COLLECTION.USERS).forEach(users => {  
      
      this.chatService.getMySwipes().forEach(s => {         
        s.swippers.forEach(ss => {
          users.forEach(u => {
            if(u.uid == ss.swippedUid) {
              matchList.push(u);
            }
          })
        });

        s.swipped.forEach((sp: any) => {
          users.forEach((u: any) => {
            if(u.uid == sp.swipperUid) {
              matchList.push(u);
            }
          })
        });

        this.matches = [...new Set(matchList)];
        
        this.isLoading = false;
        this.getChats();
      });

    });  
  }
 
  async getChats() {
    let myMessages:MessageBase[] = [];
    let activeChatsTmp = [];

    await this.firebaseService.getMyChats().then(res => {
      let user: User;
      res.forEach((chats: any) => { 
        myMessages = chats.filter((c: any) => c.uid.split("__")[0] === this.currentUser.uid || c.uid.split("__")[1] === this.currentUser.uid);
        myMessages.forEach(msg => {          
          if(msg.uid.split("__")[0] === this.currentUser.uid ) {
            user = this.getUserById(msg.uid.split("__")[1]);
            this.setUserLastMessage(msg.uid.split("__")[1], msg.messages[msg.messages.length - 1]); 
            activeChatsTmp.push(user);
            const remove = this.matches.splice(this.matches.indexOf(user), 1)[0];
            if(remove)
            this.activeChats.push(remove);
          } else {
            user = this.getUserById(msg.uid.split("__")[0]);
            this.setUserLastMessage(msg.uid.split("__")[0], msg.messages[msg.messages.length - 1]); 
            activeChatsTmp.push(user);
            const remove = this.matches.splice(this.matches.indexOf(user), 1)[0];
            if(remove) this.activeChats.push(remove);
          }
        });
        this.activeChats = [...new Set(this.activeChats)];
        console.log("this active chats ", this.activeChats);
        this.dataService.setNewMessage(true);
        
      });
    });  
  }

  setUserLastMessage(uid: string, msg: Message): User[] { 
    for(let i=0; i<this.matches.length; i++) {
      if(this.matches[i].uid == uid) {
        this.matches[i].lastMsg = msg;
      }
    }
    return this.matches;
  }

  getUserById(uid: string): User {
    return this.matches.filter(m => m.uid === uid)[0];
  }

  async getUsersInfo(users: User[], matchedUsers: any[]) {
    this.matches = [];    
    matchedUsers.forEach(m => {
      users.forEach(u => {        
        if(m.swippedUid === u.uid || m.swipperUid === u.uid ) {
          this.matches.push(u);
        }  
      })
    })
  }

  openChats(user: User) {
    console.log(user);
    this.router.navigate(['chat', user.uid, {user: JSON.stringify(user)}])
  }


  gotToUsers() {
    this.router.navigateByUrl('tabs/users', {replaceUrl: true});
  }

  getLastSendDate(user: User): string {
    return Methods.getSendDate(user.lastMsg.createdAt);
  }


}

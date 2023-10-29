import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth} from '@angular/fire/auth'; 
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
import { COLLECTION, LOGIN_TYPE } from 'src/app/utils/const';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MessageObj, Swipe, User } from '../models/models';

export interface docStatus {
  uid: string;
  exists: boolean;
};

@Injectable({
    providedIn: 'root',
})
export class ChatService {

  documentExist$ = new Subject<string>();
  dox: docStatus = {uid: "", exists: false};
  
  senderRecieverDocument$ = new BehaviorSubject(this.dox);
  recieverSenderDocument$ = new BehaviorSubject(this.dox);

  constructor( 
    public router: Router,
    private auth: Auth, 
    private afs: AngularFirestore,
    private db: AngularFireDatabase
  ) {}

  async documentExists(collection: string, uid: string){
    const reciever_sender_uid = `${uid}__${this.auth.currentUser.uid}`; 
    const sender_reciever_uid = `${this.auth.currentUser.uid}__${uid}`; 

    const doc1 =  this.afs.collection(collection).doc(sender_reciever_uid).get();
    const doc2 =  this.afs.collection(collection).doc(reciever_sender_uid).get();

    await this.afs.collection(collection).doc(sender_reciever_uid).get().forEach(dox => {
      this.senderRecieverDocument$.next({uid: sender_reciever_uid, exists: dox.exists});      
    });
    await this.afs.collection(collection).doc(reciever_sender_uid).get().forEach(dox => {
      this.recieverSenderDocument$.next({uid: reciever_sender_uid, exists: dox.exists});
    });
    const obs$ = combineLatest([this.senderRecieverDocument$, this.recieverSenderDocument$]);
    obs$.pipe(
      map((a: any,b: any) => {
        if(b && b[0] && b[0].exists) {
          return b;
        }  
        else {
          return a;
        }
      }),
    ).subscribe((results) => {
      if(results[0].exists) {
        this.documentExist$.next(results[0].uid);
        
      } else if(results[1]) {
        this.documentExist$.next(results[1].uid);

      } 
    })
    
    
  }

  getServerTimestamp() {
    return Timestamp.now().toMillis()
  }
  
  async addChatMessage(docId: string, msg: MessageObj, reciever_uid: string) {
    if(!docId) {
      docId = `${this.auth.currentUser.uid}__${reciever_uid}`
    }


    // console.log("Doc id", docId, " msg: ", msg, " rec id: ", reciever_uid);
    
    return await this.afs.collection<MessageObj>(COLLECTION.CHATS).doc(docId).set(msg, {merge: true});
  }

  addTempUsers() {
    let user: User  = { 
      uid: "",
      email: "wayne@test.com",
      name: "Wayne",
      gender: "Male",
      want: ["Friends With Benefits", "One Night Stand", "No Strings Attached"],
      with: [ "Female"],
      dob: "1995-01-01T00:21:00+02:00",
      profile_picture: "https://firebasestorage.googleapis.com/v0/b/hooked-3b11c.appspot.com/o/images%2F0tLRwFVa0chqT18TF50IWtOnjaz2%2F1676667401059.jpeg?alt=media&token=64d04cd1-6624-4824-a00d-a9ed4989147e",
      images: [],
      password: "123456",
      isVerified: false,
      loginType: LOGIN_TYPE.EMAIL,
      location: {
        distance: "",
        geo: {
          lat: 0,
          lng: 0
        }
      }
    }; 
    this.afs.collection<User>(COLLECTION.USERS).add(user)
  }

  getData(collection: string, limit: number = 100) {
    return this.afs.collection<User>(collection, ref =>
      ref.where("uid", "!=", this.auth.currentUser.uid).limit(limit)
    ).valueChanges();
  }
 
  getUsers() {
    return this.afs.collection(COLLECTION.USERS)
    .valueChanges({idField: 'uid'}) as Observable<User[]>
  }

  getSwipesById(key: string, uid: string) {
    return this.afs.collection(COLLECTION.SWIPES, ref => ref.where(key, "==", uid))
    .valueChanges({idField: 'uid'}) as Observable<Swipe[]>
  }
  
  async getOurMessages(docId: string) {
    return await this.afs.collection<MessageObj>(COLLECTION.CHATS).doc(docId).valueChanges();
  } 

  getMySwipes(limit:number = 100){
    let swipper = this.afs.collection<Swipe>(COLLECTION.SWIPES, ref =>
      ref.where("swipperUid", "==", this.auth.currentUser.uid).limit(limit)
    ).valueChanges();

    let swipped = this.afs.collection<Swipe>(COLLECTION.SWIPES, ref =>
      ref.where("swippedUid", "==", this.auth.currentUser.uid).limit(limit)
    ).valueChanges();

    return combineLatest({
      swippers: swipper,
      swipped: swipped
    })
    
  }

  getMyChats(limit:number = 100){
    return this.afs.collection(COLLECTION.CHATS)
    .valueChanges({idField: 'uid'}) as Observable<User[]>
  }


}
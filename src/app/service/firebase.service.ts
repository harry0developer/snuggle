import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
  signInWithPhoneNumber, ApplicationVerifier, sendPasswordResetEmail,
  sendEmailVerification,
  getAuth, deleteUser
} from '@angular/fire/auth';
import { doc,setDoc,Firestore, getDoc, collection, collectionData, query, where, CollectionReference } from '@angular/fire/firestore';
import { ref, Storage, UploadResult, uploadString, getStorage, getDownloadURL, StorageReference, listAll, ListResult, deleteObject } from '@angular/fire/storage';
import { from, map, Observable, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { ModalController } from '@ionic/angular';
import { MatchPage } from '../pages/match/match.page';
import { Chat, Swipe, User, Preferences } from '../models/models';

import {Photo } from '@capacitor/camera';
import { STATUS, STORAGE, COLLECTION, SWIPE_USER, LOGIN_TYPE } from '../utils/const';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  userData: any; 
  firestore: Firestore = inject(Firestore);


  constructor( 
    public router: Router,
    private auth: Auth,
    private storage: Storage,
    private afs: AngularFirestore,
    private modalCtrl: ModalController 
  ) {}
 
  setStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  } 

  getStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
  

  //new 
  async sendEmailVerification() {
    return await sendEmailVerification(this.auth.currentUser);
  }
 
  //new
  async createAccountWithEmailAndPassword(email: string, password: string)  {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password)
      return user;
    } catch (error) {
        return null;
    }
  } 

  //new 
  async deleteCurrentUser() {
    return deleteUser(this.auth.currentUser);
  }

  async createTempUserWithEmail(email: string, password: string)  {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  //new
  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
      return STATUS.SUCCESS;
    } catch (error) {
      console.log(error);
      
        return error;
    }
  } 

  async signInWithPhoneNumber(phone: string, verifier: ApplicationVerifier) {
    try {
      return await signInWithPhoneNumber(this.auth, phone, verifier)
    } catch (error) {
        return error;
    }
  }

  async forgotPassword(phone: string) {
    try {
      return await sendPasswordResetEmail(this.auth, phone);
    } catch (error) {
        return error;
    }
  }

  //new
  signout() {
    return signOut(this.auth).then(() => {
      this.removeStorageItem(STORAGE.USERS);
    })
  }

  //User preferences
  setUserPreferences(prefs: Preferences) {
    let preferences: Preferences = {
      distance: prefs.distance
    }; 
    return this.addDocumentToFirebaseWithCustomID(COLLECTION.PREFERENCES, preferences);
  }


  removeStorageItem(key: string) {
    localStorage.removeItem(key);
  }


  async updateUserProfilePicture(user: User) {
    return await this.addDocumentToFirebaseWithCustomID(COLLECTION.USERS, user);
  }

  async updateUserPhotoList(user: User, img: string) {
    console.log("User before", user);
    const deleted = user.images.splice(user.images.indexOf(img),1);
    console.log("Deleted after", deleted);
    return await this.addDocumentToFirebaseWithCustomID(COLLECTION.USERS, user);
  }

  async deletePhotoFromFirebaseStorage(user: User, img: string) {
    const fileName = this.getImageNameFromFirebaseUrl(img);
    console.log(fileName);

    const storage = getStorage();
    const desertRef = ref(storage, COLLECTION.IMAGES+"/"+this.auth?.currentUser?.uid + "/" + fileName);

    console.log(desertRef);
    
    // Delete the file
    return await deleteObject(desertRef);
    
  }

  getImageNameFromFirebaseUrl(imageUrl: string): string {
    const subPath = imageUrl.split(`${COLLECTION.IMAGES}%2F${this.auth?.currentUser?.uid}%2F`)[1];
    return subPath.split(".jpeg")[0]+'.jpeg';
  }

  // Save picture to file on device
  public async savePictureInFirebaseStorage(cameraPhoto: Photo) {

    const currentUserUid =  this.auth?.currentUser?.uid;
    const imagesRef = ref(this.storage, `images/${currentUserUid}`);
    const fileName = new Date().getTime() + '.jpeg';
    const spaceRef = ref(imagesRef, fileName);

    let savedFile: UploadResult = await uploadString(spaceRef, cameraPhoto.base64String as string, 'base64');

    return await getDownloadURL(ref(imagesRef, savedFile?.metadata.name));
  }

 
  //https://github.com/ionicthemes/ionic-firebase-image-upload/blob/master/src/app/utils/services/data.service.ts
 
  async getChats() {

    const docRef = doc(this.firestore, COLLECTION.CHATS, '')
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null
    }
    
  }


  async getCurrentUser() {
    console.log("AUTH ", this.auth);
    
    return this.getDocumentFromFirebase(COLLECTION.USERS, this.auth.currentUser.uid);
  }
 

  getChatsFromMe(uid: string) {
    collectionData<Chat>(
      query<Chat, any>(
        collection(this.firestore, COLLECTION.CHATS) as CollectionReference<Chat>,
        where('from', '==', uid)
      ), { idField: 'uid' }
    );
  }

  getChatsSendToMe(uid: string) {
    return new Promise<any>((resolve)=> {
      collectionData<Chat>(
        query<Chat, any>(
          collection(this.firestore, COLLECTION.CHATS) as CollectionReference<Chat>,
          where('to', '==', uid),
          where('from', '==', uid)
        ), { idField: 'uid' } 
      );
    });
  }
 
  async getAllUsers(){
    return this.afs.collection<User>(COLLECTION.USERS).get();
  }

  async getAllChats(){
    return this.afs.collection<User>(COLLECTION.CHATS).get();
  }

  queryUsersByEmail(email: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(COLLECTION.USERS, ref => ref.where('email', '==', email).limit(1)).valueChanges().subscribe(user => resolve(user))
    });
  }

  getChatsFrom(uid: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(COLLECTION.CHATS, ref => ref.where('from', '==', uid)).valueChanges().subscribe(res => resolve(res))
    });
  }
  getChatsTo(uid: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(COLLECTION.CHATS, ref => ref.where('to', '==', uid)).valueChanges().subscribe(res => resolve(res))
    });
  }

  queryUsersByUid(collection: string, uid: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(collection, ref => ref.where('uid', '==', uid).limit(1)).valueChanges().subscribe(user => resolve(user))
    });
  } 

  async getMySwippes() {
    return await collectionData<Swipe>(
      query<Swipe, any>(
        collection(this.firestore, COLLECTION.SWIPES) as CollectionReference<Swipe>,
        where('swipperUid', '==', this.auth?.currentUser?.uid),
      ), { idField: 'uid' }
    );
  }

  async getMyChats() {
    return await collectionData<Chat>(
      query<Chat, any>(
        collection(this.firestore, COLLECTION.CHATS) as CollectionReference<any>,
      ), { idField: 'uid' }
    );
  }

  async getMyMatches() {
    return await collectionData<Swipe>(
      query<Swipe, any>(
        collection(this.firestore, COLLECTION.SWIPES) as CollectionReference<Swipe>,
        where('swipperUid', '==', this.auth?.currentUser?.uid),
        where('match', '==', true),
      ), { idField: 'uid' }
    );
  }

  querySwipeUsers(uid: string, status:boolean) {
    const me = this.auth?.currentUser?.uid;
    const swippedUid = uid;

    //This person swipped on me before
    const ref = collectionData<Swipe>(
      query<Swipe, any>(
        collection(this.firestore, COLLECTION.SWIPES) as CollectionReference<Swipe>,
        where(SWIPE_USER.SWIPPED_UID, '==', me),
        where(SWIPE_USER.SWIPPER_UID, '==', swippedUid),
      ), { idField: 'uid' }
    );

    return new Promise<string>((resolve, reject) => {
      ref.pipe(take(1)).forEach((res: any) => {
        // No data, then am the first swipper
        if(!res || res.length < 1) {
          const swipeData: Swipe = {
            swipperUid: me,
            swippedUid: uid,
            like: status,
            match: false
          }
          this.addDocToFirebasetWithAutoGenID(COLLECTION.SWIPES, swipeData).then(r => {
            console.log("Data added", r.id);
            resolve(STATUS.SUCCESS);
          }).catch(err => {
            console.log("shit went down");
            resolve(STATUS.FAILED);
          });
        } else { 
          const resDoc = res[0];          
          if(resDoc.like) { //if likes me, then show its a match
            resDoc.match = true;
            const docRef = doc(this.firestore, COLLECTION.SWIPES, resDoc.uid);
            setDoc(docRef, resDoc, {merge: true});
            console.log("We got a match");
           this.getDocumentFromFirebase(COLLECTION.USERS, resDoc.swipperUid).then(r => {
             if(r) {
              this.showMatchModal(r);
               console.log("Its a match", r);
              } else {
                console.log("Could not get user");
                
              }
            })
            resolve(STATUS.SUCCESS);
          } else {   // if dont like me then remove from swipped
            // this.removeDocumentFromFirebase(col, docUid) 
            this.removeDocumentFromFirebase(COLLECTION.SWIPES, resDoc.uid);
            resolve(STATUS.SUCCESS);
          }
        }
      });
    })
  }

  private async showMatchModal(user: any){    
    const modal = await this.modalCtrl.create({
      component: MatchPage,
      componentProps: { 
        user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
    
  }
 
  private  getServerTimestamp() {
    return Timestamp.now().toMillis();
  }
  

  private async removeDocumentFromFirebase(col: string, docId: string) {    
    return await this.afs.collection(col).doc(docId).delete();
  } 

  queryUsersBySwippedUid(collection: string, uid: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(collection, ref => ref.where('swipped', '==', uid).limit(1)).valueChanges().subscribe(user => resolve(user))
    });
  }

  async getDocumentFromFirebase(collection: string, uid: string){
    return new Promise<any>((resolve)=> {
      this.afs.collection(collection, ref => ref.where('uid', '==', uid).limit(1)).valueChanges().subscribe(user => resolve(user[0]))
    });
  }

  async addDocumentToFirebaseWithCustomID(collection: string, data: any) {
    return await this.afs.collection(collection).doc(data.uid).set(data);
  }

  async createAccountWithMobile(collection: string, user: any) {
    const data: User = {
      uid: "",
      name: "",
      email: "",
      password: "",
      gender: "",
      want: [],
      with: [],
      dob: "",
      phone: user.phoneNumber,
      loginType: LOGIN_TYPE.PHONE,
      images: [],
      profile_picture: "",
      isVerified: true, 
      location: {
          distance: "",
          geo: {
            lat: 0,
            lng: 0
          }
      }
    };
    
    const docRef = doc(this.firestore, collection, user.uid);
    await setDoc(docRef, data, {merge: true});
  }

  async updateUserProfile(collection: string, user: User) {
    const docRef = doc(this.firestore, collection, user.uid);
    await setDoc(docRef, user, {merge: true});
  }

  async addDocToFirebasetWithAutoGenID(col: string, data: any) {
    return await this.afs.collection(col).add(data);
  }
 

  getImages(bucketPath: string): Observable<any> {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = getStorage();

    // Create a storage reference from our storage service
    const storageRef = ref(storage);

    // Points to our firestorage folder with path bucketPath
    const folderRef = ref(storageRef, bucketPath);

    return from(this.getDownloadURLs(folderRef))
    .pipe(
      map(urls => {
         
        return urls;
      })
    );
  }

  private getDownloadURLs(imagesRef: StorageReference): Promise<string[]> {
    return new Promise((resolve, reject) => {
      listAll(imagesRef)
      .then((listResult: ListResult) => {
        let downloadUrlsPromises: Promise<string>[] = [];

        listResult.items.forEach((itemRef: StorageReference) => {
          // returns the download url of a given file reference
          const itemUrl = getDownloadURL(ref(imagesRef, itemRef.name));
          downloadUrlsPromises.push(itemUrl);
        });

        Promise.all(downloadUrlsPromises)
        .then((downloadUrls: string[]) => resolve(downloadUrls));
      }).catch((error) => reject(error));
    });
  }

  findInString(message: string, str: string): boolean {
    console.log(message, " Key: ", str);
    
    if(message)
      return message.search(str) > 1;
    return false;
  }

  capitalize(s: any[]): string{
      return s && s[0].toUpperCase() + s.slice(1);
  }
}
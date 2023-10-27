import { Injectable } from '@angular/core'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country, Flags, Message } from '../models/models';

@Injectable({
    providedIn: 'root',
})
export class DataService {
  
  private chats = new BehaviorSubject<Message[] | null>(null);
  chats$ = this.chats.asObservable();

  private newMessage = new BehaviorSubject<boolean>(false);
  newMessage$ = this.newMessage.asObservable();

  countries: any = [];
  flags: any = [];
  
  constructor(public http: HttpClient) {}

  getCountries() {
    this.http.get('assets/countries.json').forEach(c => {
      this.countries = c;   
    });
  }

  // async getCountries() {
  //   this.countries = [];
  //   await this.http.get('assets/flags.json').forEach(flags => {
  //     this.flags = flags;
  //   });
  //   await this.http.get('assets/countries.json').forEach(c => {
  //     this.countriesWithoutFlags = c;   
  //   });

  //   console.log("Flags", this.flags);
  //   console.log("Countries", this.countriesWithoutFlags);
    
  //   this.flags.forEach(f => {
  //     this.countriesWithoutFlags.forEach(c => {
  //       if(f.code.toLocaleLowerCase() === c.code.toLocaleLowerCase()) {
  //         c.flag = f.flag;
  //         this.countries.push(c);
  //       }
  //     })
  //   })
  // }



  getFlags(): Observable<Flags> {
    return this.http.get('assets/flags.json') as Observable<Flags>;
  }
  
  setChats(chats: Message[]) {
    this.chats.next(chats);
  }

  setNewMessage(newMessage: boolean) {
    this.newMessage.next(newMessage);
  }
  filterItems(searchTerm: string) {    
    return this.countries.filter((item: any) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
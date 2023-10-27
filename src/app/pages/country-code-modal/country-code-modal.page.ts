import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
 import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { debounceTime } from 'rxjs';
import { Country, Flags } from 'src/app/models/models';

@Component({
  selector: 'app-country-code-modal',
  templateUrl: './country-code-modal.page.html',
  styleUrls: ['./country-code-modal.page.scss'],
})
export class CountryCodeModalModalPage implements OnInit{
  countries: any = [];

  searchControl: FormControl;
  searching: any = false; 
  searchTerm: string = '';
  items: any;
  flags: any;

  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private dataService: DataService) {
    this.searchControl = new FormControl();
  } 

  ngOnInit(): void {
    this.dataService.getCountries();
  } 
 
  ionViewWillEnter() {
    this.setFilteredItems();      
    this.searchControl.valueChanges
    .pipe(debounceTime(400)
    ).subscribe(search => {
      this.searchTerm = search
        this.searching = false;
        this.setFilteredItems();
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems() {
    this.countries = this.dataService.filterItems(this.searchTerm);
  }

  selectCountry(country: any) {
    this.modalCtrl.dismiss(country, 'save');
  }

  confirm() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
 
}
import { Component, Input, OnInit } from '@angular/core';

import { ModalController, RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';
import { Preferences } from 'src/app/models/models';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  @Input() distance: string;

  ageRange: any;
  // distance: RangeValue;

  distanceFilter = {
    min: 1,
    max: 120,
    value: 50
  };

  currentDistance: number;
  constructor(
    private modalCtrl: ModalController,
    ) { 
      
    }

  onIonChangeDistance(ev: any) {
    // this.distance = (ev as RangeCustomEvent).detail.value;
    this.distanceFilter.value = ev.detail.value;
  }

  filterChange(event: any) {
    this.distanceFilter.value = event.detail.value;
  }

  pinFormatter(value: number) {
    return `${value} km`;
  }
  
  
  applyFilter() {
    console.log("Filter by", this.distanceFilter.value);
    this.modalCtrl.dismiss(this.distanceFilter.value, "filter");
    
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  resetFilter() {
    this.distanceFilter = {
      min: 1,
      max: 120,
      value: 50
    }
    // this.distance = 50;
  }

  ngOnInit() {
  }


}

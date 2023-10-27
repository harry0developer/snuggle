
import {
  Component, 
  Input,
} from "@angular/core";
import { User } from "src/app/models/models";

import moment from 'moment';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.page.html',
  styleUrls: ['./swipe-card.page.scss'],
})
export class SwipeCardPage {
 
  @Input() user: User;

  getUserAge(user: User){
    return  moment().diff(user.dob, 'years');
  }

 
}

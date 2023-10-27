import { User } from "src/app/models/models";

import * as moment from 'moment';

export default class Methods {
    static getUserAge(user: User){
        return  moment().diff(user.dob, 'years');
    }

    static getSendDate(milisec: string) : string{
        return moment(new Date(milisec), "YYYYMMDD").fromNow();
    }
}
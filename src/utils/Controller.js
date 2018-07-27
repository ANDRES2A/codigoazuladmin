import {auth,db, storage, logout} from './Firebase.js';
import axios from 'axios';
import {url} from './Config.js';

export function setActiveFalse(key){
    let ref = db.ref('alerts/'+key+'/active');
    ref.set(false);
}

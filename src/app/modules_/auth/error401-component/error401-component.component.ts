import { environment } from './../../../../environments/environment';
import {Component, OnInit} from '@angular/core';


@Component({
    selector: 'cats-error401',
    templateUrl: './error401-component.html',
    styleUrls: ['./error401-component.css']
})

export class Error401Component implements OnInit {

    ngOnInit() {}

    backToLogin(){
        // // console.log('..............backToLogin............');
        window.location.href = environment._AUTH_GATEWAY_URL;
    }
}

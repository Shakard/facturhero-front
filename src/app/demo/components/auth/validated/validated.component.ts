import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-validated',
    templateUrl: './validated.component.html',
    styleUrls: ['./validated.component.scss'],
})
export class ValidatedComponent implements OnInit {
    timeLeft: number = 5;
    interval:any;

    constructor(public router: Router) {}

    ngOnInit() {
        this.startTimer();
        setTimeout(() => {
            this.router.navigate(['auth/login']);
        }, 5000);
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.timeLeft = 60;
            }
        }, 1000);
    }
}

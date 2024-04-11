import { Inject } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-call-info-dialog',
    templateUrl: './callinfo-dialog.component.html',
    styleUrls: ['./callinfo-dialog.component.scss']
})
export class CallinfoDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<CallinfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _snackBar: MatSnackBar,
        private messageService: MessageService
    ) { }

    public showCopiedSnackBar() {
        this.messageService.add({ key: 'copied', severity: 'success', summary: 'Videocall ID copied', detail: 'You can now share it with your friend for them to join you in this call!', sticky: true});
    }
}

export interface DialogData {
    peerId?: string;
    joinCall: boolean
}
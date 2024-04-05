import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { CallService } from '../../services/call.service';
import { CallinfoDialogComponent, DialogData } from '../callinfo-dialog/callinfo-dialog.component';
import MediaStream from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './videocall.component.html',
  styleUrls: ['./videocall.component.scss']
})
export class VideocallComponent implements OnInit, OnDestroy {
  isCallStarted!: boolean;
  hasPeerJoined: boolean = false
  private peerId: string;

  @ViewChild('localVideo')
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo')
  remoteVideo!: ElementRef<HTMLVideoElement>;

  constructor(public dialog: MatDialog, private callService: CallService) {
    this.callService.isCallStarted$.subscribe(
      (booleanVal) => this.isCallStarted = booleanVal
    );

    this.callService.hasPeerJoined$.subscribe(
      (booleanVal) => {
        this.hasPeerJoined = booleanVal
        console.log('has peer joined: ', booleanVal)
      }
    );

    this.peerId = this.callService.initPeer();
  }
  
  ngOnInit(): void {
    // isCallStarted$: Observable<boolean>;
    this.callService.localStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => this.localVideo.nativeElement.srcObject = stream)
    this.callService.remoteStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream)
  }
  
  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }

  public showModal(joinCall: boolean): void {
    console.log('videocall.component -- showModel()')

    let dialogData: DialogData = joinCall ? ({ peerId: undefined, joinCall: true }) : ({ peerId: this.peerId, joinCall: false });
    const dialogRef = this.dialog.open(CallinfoDialogComponent, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(peerId => 
          joinCall ? of(this.callService.establishMediaCall(peerId)) : of(this.callService.enableCallAnswer())
        ),
      )
      .subscribe(_  => { });
  }

  public endCall() {
    console.log('videocall.component -- endCall() ')

    this.callService.closeMediaCall();
  }
}
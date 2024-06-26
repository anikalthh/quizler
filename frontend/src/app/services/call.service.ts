import { Injectable } from '@angular/core';
import Peer, { MediaConnection, PeerError, PeerJSOption, } from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class CallService {

  private peer!: Peer;
  private mediaCall!: MediaConnection;

  private localStreamBs: BehaviorSubject<MediaStream | null> = new BehaviorSubject<MediaStream | null>(null);
  public localStream$ = this.localStreamBs.asObservable();
  private remoteStreamBs: BehaviorSubject<MediaStream | null> = new BehaviorSubject<MediaStream | null>(null);
  public remoteStream$ = this.remoteStreamBs.asObservable();

  private isCallStartedBs = new Subject<boolean>();
  public isCallStarted$ = this.isCallStartedBs.asObservable();

  private hasPeerJoinedBs = new Subject<boolean>();
  public hasPeerJoined$ = this.hasPeerJoinedBs.asObservable();

  constructor(private snackBar: MatSnackBar) { }

  public initPeer(): any {
    console.log('call.service -- initPeer()')

    if (!this.peer || this.peer.disconnected) {
      const peerJsOptions: PeerJSOption = {
        debug: 3,
        config: {
          iceServers: [
            {
              urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
              ],
            }]
        }
      };
      try {
        let id = uuidv4();
        this.peer = new Peer(id, peerJsOptions);
        return id;
      } catch (error) {
        console.error('error: ', error);
      }
    }
  }

  public async establishMediaCall(remotePeerId: string) { // for user to join call
    console.log('call.service -- establishMediaCall()')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const connection = this.peer.connect(remotePeerId); // connects to the first user via peer id
      connection.on('error', err => {
        console.error(err);
      });

      this.mediaCall = this.peer.call(remotePeerId, stream);
      if (!this.mediaCall) {
        let errorMessage = 'Unable to connect to remote peer';
        this.snackBar.open(errorMessage, 'Close');
        throw new Error(errorMessage);
      }
      this.localStreamBs.next(stream);
      console.log('iscallstarted2:', this.isCallStarted$)
      this.isCallStartedBs.next(true);
      this.hasPeerJoinedBs.next(true);

      this.mediaCall.on('stream',
        (remoteStream: MediaStream) => {
          this.remoteStreamBs.next(remoteStream);
        });
      this.mediaCall.on('error', err => {
        // this.snackBar.open(err, 'Close');
        console.error(err);
        this.isCallStartedBs.next(false);
      });
      this.mediaCall.on('close', () => this.onCallClose());
    }
    catch (ex) {
      console.error(ex);
      // this.snackBar.open(ex, 'Close');
      this.isCallStartedBs.next(false);
    }
  }

  public async enableCallAnswer() { // to start a call
    console.log('call.service -- enableCallAnswer()')
    this.isCallStartedBs.next(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStreamBs.next(stream);
      this.peer.on('call', async (call) => {

        this.mediaCall = call;
        console.log('iscallstarted1: ', this.isCallStarted$)
        this.isCallStartedBs.next(true);

        this.mediaCall.answer(stream);
        this.mediaCall.on('stream', (remoteStream: MediaStream) => {
          console.log('should get 2 videos here')
          this.hasPeerJoinedBs.next(true);
          this.remoteStreamBs.next(remoteStream);
        });
        this.mediaCall.on('error', (error: PeerError<"negotiation-failed" | "connection-closed">) => {
          this.snackBar.open(error.message, 'Close');
          this.isCallStartedBs.next(true);
          console.error(error);
        });
        this.mediaCall.on('close', () => this.onCallClose());
      });
    }
    catch (ex) {
      console.error(ex);
      // this.snackBar.open(ex, 'Close');
      this.isCallStartedBs.next(false);
    }
  }

  private onCallClose() {
    console.log('call.service -- onCallClose()')

    if (this.remoteStreamBs?.value) {
      this.remoteStreamBs.value.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (this.localStreamBs?.value) {
      this.localStreamBs.value.getTracks().forEach(track => {
        track.stop();
      });
    }
    // this.snackBar.open('Call Ended', 'Close');
  }

  public closeMediaCall() {
    console.log('call.service -- closeMediaCall()')

    this.mediaCall?.close();
    if (!this.mediaCall) {
      this.onCallClose()
    }
    this.isCallStartedBs.next(false);
  }

  public destroyPeer() {
    this.mediaCall?.close();
    this.peer?.disconnect();
    this.peer?.destroy();
  }

}
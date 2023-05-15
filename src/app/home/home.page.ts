import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicModule,
  ToastController,
  LoadingController,
  Platform,
} from "@ionic/angular";
import jsQR from "jsqr";
import { MyNavigator } from "./naviator";
import { HttpClientModule } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import axios from "axios";
import { environment } from "src/environments/environment.dev";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  standalone: true,
  imports: [IonicModule, HttpClientModule],
})
export class HomePage {
  scanActive = false;
  scanResult: string = "";
  loading: HTMLIonLoadingElement | null = null;
  @ViewChild("video", { static: false }) video!: ElementRef;
  @ViewChild("canvas", { static: false }) canvas!: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private cookieService: CookieService,
    private router: Router
  ) {
    const isInStandaloneMode = () =>
      "standalone" in navigator && (navigator as MyNavigator).standalone;
    if (this.plt.is("ios") && isInStandaloneMode()) {
      console.log("I am a an iOS PWA!");
      // E.g. hide the scan functionality!
    }
  }

  ngOnInit() {
    const token = this.cookieService.get("token");
    if (!token) {
      this.router.navigate(["/login"]);
    }
  }

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext("2d");
  }

  stopScan() {
    this.scanActive = false;
  }

  reset() {
    this.scanResult = "";
  }

  async showQrToast() {
    /*const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            if(this.scanResult)
                window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
    */
    console.log(this.scanResult);
  }

  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute("playsinline", true);

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.showQrToast();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
    this.onSubmit();
  }

  async onSubmit() {
    const apiURL = environment.apiURL;

    try {
      const response = await axios.get(apiURL + "/api/devices/VJLOCF3JYBQD/");
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("Response error");
    }
  }
}

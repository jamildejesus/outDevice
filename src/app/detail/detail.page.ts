import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DetailService } from "../detail.service";
import axios from "axios";
import { environment } from "src/environments/environment.dev";
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DetailPage implements OnInit {
  constructor(
    private detailService: DetailService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  assetTag: string = "";
  serialNumber: string = "";
  associatedId: string = "";
  deviceId: string = "";
  assignedTo: string = "";
  async ngOnInit() {
    this.assetTag = this.detailService.assetTag;
    this.serialNumber = this.detailService.serialNumber;
    this.associatedId = this.detailService.associatedId;
    this.deviceId = this.detailService.deviceId;
    this.assignedTo = this.detailService.assignedTo;
  }

  async ngOnAuthorize() {
    const apiURL = environment.apiURL;

    try {
      await axios.post(apiURL + "/api/device-associated/", {
        device: this.deviceId,
        associate: this.associatedId,
      });

      this.detailService.assetTag = "";
      this.detailService.serialNumber = "";
      this.detailService.associatedId = "";
      this.detailService.deviceId = "";
      this.detailService.assignedTo = "";

      const toast = await this.toastCtrl.create({
        message: "Authorized!",
        position: "top",
        buttons: [
          {
            text: "Scan new",
            handler: () => {
              this.router.navigate(["/home"]);
            },
          },
        ],
        duration: 5000,
      });
      toast.present();
      this.router.navigate(["/home"]

      /*setTimeout(() => {
        this.detailService.assetTag = "";
        this.detailService.serialNumber = "";
        this.detailService.associatedId = "";
        this.detailService.deviceId = "";
        this.detailService.assignedTo = "";
        this.router.navigate(["/home"]);
      }, 5000);*/
    } catch (error) {
      console.log(error);
    }
  }
}

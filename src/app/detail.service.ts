import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DetailService {
  serialNumber: string = "";
  assetTag: string = "";
  deviceId: string = "";
  associatedId: string = "";
  assignedTo: string = ""
  constructor() {}
}

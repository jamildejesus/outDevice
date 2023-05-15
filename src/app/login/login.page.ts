import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "src/environments/environment.dev";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import axios from "axios";

interface LoginResponse {
  access: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class LoginPage implements OnInit {
  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit() {
    const token = this.cookieService.get('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }
  username: string = "";
  password: string = "";
  isError: boolean = false;

  async onSubmit(): Promise<any> {
    // Aquí puedes agregar la lógica para validar el inicio de sesión
    const apiURL = environment.apiURL;

    try {
      const response = await axios.post(apiURL + "/api/token/", {
        username: this.username,
        password: this.password,
      });

      if (response.status === 200 && response.data.access) {
        this.cookieService.set("token", response.data.access);
        return this.router.navigate(["/home"]);
      }
      this.isError = true
    } catch (error: any) {
      if (error) {
        this.isError = true;

        setTimeout(() => {
          this.isError = false;
        }, 5000);
      }
    }
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { AppConfig } from "./config";

@Injectable({ providedIn: 'root' })
export class ConfigLoaderService {
  constructor(private http: HttpClient) {}

  loadConfig(): Promise<AppConfig> {
    return firstValueFrom(this.http.get<AppConfig>('/assets/config.json'));
  }
}

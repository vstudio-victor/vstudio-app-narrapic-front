export * from './captions.service';
import { CaptionsService } from './captions.service';
export * from './generate.service';
import { GenerateService } from './generate.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [CaptionsService, GenerateService, UsersService];

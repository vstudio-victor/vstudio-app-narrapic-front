import { NgModule } from '@angular/core';
import { GeneratePromptService } from './generate-prompt.service';
import { GeneratedCaptionsService } from './generated-captions.service';

@NgModule({
  providers: [GeneratePromptService, GeneratedCaptionsService],
})
export class ServicesModule {}

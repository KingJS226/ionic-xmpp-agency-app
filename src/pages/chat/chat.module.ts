import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { HeaderComponentModule } from '../../components/header/header.module';
import { RelativeTime } from "../../pipes/relative-time";
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji";

@NgModule({
  declarations: [
    ChatPage,
    RelativeTime
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    EmojiPickerComponentModule,
    HeaderComponentModule
  ],
  exports: [
      ChatPage,
  ],
  // provider: [
  //   EmojiProvider
  // ],
})
export class ChatPageModule {}

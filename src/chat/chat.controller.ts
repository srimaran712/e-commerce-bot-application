import { BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';


@Controller('chat')
export class ChatController {
 
    constructor(
    private  chatService: ChatService,
  ) {}

  @Post()
  async chat(@Body() dto: ChatDto) {
    if (!dto.sessionId) {
      throw new BadRequestException('sessionId is required');
    }

    return this.chatService.chat(
      dto.sessionId,
      dto.message,
    );
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';



@Schema()
export class Conversation extends Document {
  @Prop({ required: true, unique: true }) 
  sessionId?: string;
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] }) 
  messages?: ChatCompletionMessageParam[];
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
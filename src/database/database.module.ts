import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports:[MongooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: 'mongodb://manimaransrinivasan35_db_user:Maransjc123^6@ac-kjn9elo-shard-00-00.mekezgj.mongodb.net:27017,ac-kjn9elo-shard-00-01.mekezgj.mongodb.net:27017,ac-kjn9elo-shard-00-02.mekezgj.mongodb.net:27017/ecommerce-chat-application?ssl=true&replicaSet=atlas-e5t3ph-shard-0&authSource=admin&appName=learningMongo',
         
        };
      },
    }),]
})
export class DatabaseModule {
   
}

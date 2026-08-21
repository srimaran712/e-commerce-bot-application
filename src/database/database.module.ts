import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule , ConfigService} from '@nestjs/config';


@Module({
    imports:[ConfigModule.forRoot(), MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGODB_URL'),
        };
      },
      inject: [ConfigService],
    }),]
})
export class DatabaseModule {
   
}

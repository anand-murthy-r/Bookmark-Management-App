import { Module, Global } from '@nestjs/common';
import { CassandraService } from './database.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [CassandraService, ConfigService],
  exports: [CassandraService],
})
export class DatabaseModule {}
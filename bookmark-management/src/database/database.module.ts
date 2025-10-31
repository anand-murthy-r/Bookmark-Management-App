import { Module, Global } from '@nestjs/common';
import { Client } from 'cassandra-driver';

const cassandraProvider = {
  provide: 'CASSANDRA_CLIENT',
  useFactory: async () => {
    const client = new Client({
      contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'cassandra'],  // or your cluster IPs
      localDataCenter: process.env.CASSANDRA_LOCAL_PC || 'datacenter1',
      keyspace: process.env.CASSANDRA_KEYSPACE || 'testkeyspace',
    });
    await client.connect();
    console.log('✅ Connected to Cassandra');
    return client;
  },
};

@Global()
@Module({
  providers: [cassandraProvider],
  exports: ['CASSANDRA_CLIENT'],
})
export class DatabaseModule {}
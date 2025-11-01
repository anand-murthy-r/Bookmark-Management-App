import {Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'cassandra-driver';

@Injectable()
export class CassandraService implements OnModuleInit {
    private usersClient: Client;
    private bookmarksClient: Client;

    constructor(private config: ConfigService) {
        // console.log(this.config.get('CASSANDRA_CONTACT_POINTS') || '127.0.0.1');
        this.usersClient = new Client({
            contactPoints: [this.config.get('CASSANDRA_CONTACT_POINTS') || '127.0.0.1'],  // or your cluster IPs
            localDataCenter: this.config.get('CASSANDRA_LOCAL_PC') || 'datacenter1',
            keyspace: this.config.get('CASSANDRA_USER_KEYSPACE') || 'users',
        });

        this.bookmarksClient = new Client({
            contactPoints: [this.config.get('CASSANDRA_CONTACT_POINTS') || '127.0.0.1'],  // or your cluster IPs
            localDataCenter: this.config.get('CASSANDRA_LOCAL_PC') || 'datacenter1',
            keyspace: this.config.get('CASSANDRA_BOOKMARK_KEYSPACE') || 'bookmarks',
        });
    }
    
    async onModuleInit() {
        await this.usersClient.connect();         // connect to User Keyspace
        await this.bookmarksClient.connect();     // connect to Bookmark Keyspace
        console.log("Cassandra connection established!");
    }

    getUsersClient() {
        return this.usersClient;
    }

    getContentClient() {
        return this.bookmarksClient;
    }
}
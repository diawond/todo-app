// src/lib/appwrite.ts
import { Client, Databases, ID } from 'appwrite';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('68407f6f0011e0c0a947');

const databases = new Databases(client);

export { client, databases, ID };

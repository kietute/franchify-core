import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ElasticService {
  constructor() {}

  async getHealth() {
    try {
      const healthResponse = await axios.get(
        `https://sQLdDWuC43:vZ6rCRuzKDLmH9cN@marketfloor-2626016716.us-east-1.bonsaisearch.net:443/_cat/health`,
        {
          auth: {
            username: 'sQLdDWuC43',
            password: 'vZ6rCRuzKDLmH9cN',
          },
        },
      );
      if (healthResponse) {
        return healthResponse;
      }
    } catch (error) {
      throw error;
    }
  }

  async bulk(index?: string, data?: { [key: string]: any }) {
    try {
      // Create the bulk data in NDJSON format
      const bulkData =
        `
      { "index": { "_index": "${index || 'products'}", "_id": "10" } }
      { "name": "Product 1", "price": 100, "description": "Description for Product 1" }
      { "index": { "_index": "${index || 'products'}", "_id": "11" } }
      { "name": "Product 2", "price": 200, "description": "Description for Product 2" }
      { "index": { "_index": "${index || 'products'}", "_id": "12" } }
      { "name": "Product 3", "price": 150, "description": "Description for Product 3" }
    `.trim() + '\n'; // Append a newline character at the end

      // Send the bulk request to Elasticsearch
      const bulkResponse = await axios.post(
        `https://sQLdDWuC43:vZ6rCRuzKDLmH9cN@marketfloor-2626016716.us-east-1.bonsaisearch.net:443/_bulk`,
        bulkData,
        {
          headers: {
            'Content-Type': 'application/x-ndjson', // Use x-ndjson for bulk data
          },
          auth: {
            username: 'sQLdDWuC43',
            password: 'vZ6rCRuzKDLmH9cN',
          },
        },
      );

      // Check if the response is successful
      if (bulkResponse) {
        return bulkResponse;
      }
    } catch (error) {
      console.log(
        'Bulking error:',
        error.response ? error.response.data : error,
      );
      throw error; // Re-throw the error after logging it
    }
  }
}

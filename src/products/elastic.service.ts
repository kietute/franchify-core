import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ElasticService {
  constructor(private configService: ConfigService) {}

  async getHealth() {
    try {
      const healthResponse = await axios.get(
        `${this.configService.get('ELASTIC_END_POINT')}/_cat/health`,
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

  async bulk<T>(index?: string, data?: T[]) {
    try {
      const plainData = data.map((item) => instanceToPlain(item));
      const bulkData =
        plainData
          .map((item, idx) => {
            return `
          { "index": { "_index": "${index || 'default_index'}", "_id": "${item?.id || idx}" } }
          ${JSON.stringify(item)}
          `.trim();
          })
          .join('\n') + '\n';

      const bulkResponse = await axios.post(
        `${this.configService.get('ELASTIC_END_POINT')}/_bulk`,
        bulkData,
        {
          headers: {
            'Content-Type': 'application/x-ndjson',
          },
          auth: {
            username: 'sQLdDWuC43',
            password: 'vZ6rCRuzKDLmH9cN',
          },
        },
      );
      if (bulkResponse) {
        return bulkResponse;
      }
    } catch (error) {
      console.log(
        'Bulking error:',
        error.response ? error.response.data : error,
      );
      throw error;
    }
  }

  async search(keyword: string) {
    try {
      const elasticSearchResponse = await axios.post(
        `${this.configService.get('ELASTIC_END_POINT')}/products/_search`,
        {
          query: {
            match: {
              name: {
                query: keyword,
                operator: 'and',
              },
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const hits = elasticSearchResponse?.data?.hits?.hits || [];
      return {
        ...elasticSearchResponse.data,
        data: hits.map((item: any) => item._source),
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new ServiceUnavailableException('Not able to search at the moment');
    }
  }
}

import { Expose } from 'class-transformer';

export class StoreDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  storeCode: string;

  @Expose()
  supportDelivery: boolean;

  @Expose()
  supportPickup: boolean;

  @Expose()
  openTime: number;

  @Expose()
  closeTime: number;

  @Expose()
  lng: number | null; // Cho phép null

  @Expose()
  lat: number | null; // Cho phép null
}

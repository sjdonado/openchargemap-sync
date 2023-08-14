import type * as MUUID from 'uuid-mongodb';

export type POIListSnapshot = {
  _id: MUUID.MUUID;
  poiListIds: MUUID.MUUID[];
  countriesProcessed: number;
  isCompleted: boolean;
};

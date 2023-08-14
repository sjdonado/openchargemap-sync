import { type Document, type WithId } from 'mongodb';

import { type POI } from '../@types/pois';

export const serializePOIList = (snapshot: Array<WithId<Document>>): POI[] =>
  snapshot.map((doc: WithId<Document>) => {
    const { _id, ...poi } = doc;

    return poi as POI;
  });

import { type Document, type WithId } from 'mongodb';

import { type Edge } from '../@types/pagination';
import { type POI } from '../@types/pois';

export const poiListToEdges = (snapshot: Array<WithId<Document>>): Array<Edge<POI>> =>
  snapshot.map((doc: WithId<Document>) => {
    const { _id, ...node } = doc;

    return {
      cursor: _id.toString(),
      node: node as POI,
    };
  });

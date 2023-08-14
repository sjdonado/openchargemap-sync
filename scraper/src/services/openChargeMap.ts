import axios from 'axios';

import { type POI, type CoreReferenceData } from '../@types/poi';

import env from '../config/env';
import { POI_LIST_MAX_RESULTS } from '../config/constant';

export const fetchReferenceData = async () => {
  const endpoint = `${env.OPENCHARGEMAP_BASE_URL}/referencedata`;
  const response = await axios(endpoint, {
    headers: {
      'X-API-Key': env.OPENCHARGEMAP_API_KEY,
    },
  });

  const data = response.data as CoreReferenceData;

  const allowedCountriesSet = new Set(env.OPENCHARGEMAP_ALLOWED_COUNTRIES.split(','));
  const countries = data.Countries.filter((c) => allowedCountriesSet.has(c.ISOCode));

  return { countries };
};

export const fetchPOIList = async (countryId: number) => {
  const endpoint = `${env.OPENCHARGEMAP_BASE_URL}/poi`;
  const response = await axios(endpoint, {
    params: {
      countryid: countryId,
      maxresults: POI_LIST_MAX_RESULTS,
    },
    headers: {
      'X-API-Key': env.OPENCHARGEMAP_API_KEY,
    },
  });

  const poiList = response.data as POI[];

  return poiList;
};

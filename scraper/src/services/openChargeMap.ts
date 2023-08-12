import axios from 'axios';

import env from '../config/env';

export type Country = {
  ID: number;
  ISOCode: string;
  ContinentCode: string;
  Title: string;
};

type AddressInfo = {
  ID: number;
  Description: string;
  AddressLine1: string;
  AddressLine2?: string;
  Town: string;
  StateOrProvince: string;
  Postcode: string;
  CountryID: number;
  Country: Country;
  Latitude: number;
  Longitude: number;
  ContactTelephone1?: string;
  ContactTelephone2?: string;
  ContactEmail?: string;
  AccessComments?: string;
  RelatedURL?: string;
  Distance?: number;
  DistanceUnit: number;
};

type OperatorInfo = {
  ID: number;
  description: string;
  WebsiteURL: string;
  Comments?: string;
  PhonePrimaryContact?: string;
  PhoneSecondaryContact?: string;
  IsPrivateIndividual: boolean;
  AddressInfo?: AddressInfo;
  BookingURL?: string;
  ContactEmail?: string;
  FaultReportEmail?: string;
  IsRestrictedEdit: boolean;
};

type StatusType = {
  ID: number;
  description: string;
  IsOperational: boolean;
  IsUserSelectable: boolean;
};

type ConnectionType = {
  ID: number;
  title: string;
  FormalName: string;
  IsDiscontinued: boolean;
  IsObsolete: boolean;
};

type Connection = {
  ID: number;
  ConnectionTypeID: number;
  ConnectionType: ConnectionType;
  Reference?: string;
  StatusTypeID: number;
  StatusType: StatusType;
  LevelID: number;
  Level: any;
  Amps?: number;
  Voltage?: number;
  PowerKW: number;
  CurrentTypeID: number;
  CurrentType: any;
  Quantity: number;
  Comments?: string;
};

export type CoreReferenceData = {
  Countries: Country[];
};

export type POI = {
  OperatorInfo: OperatorInfo;
  StatusType: StatusType;
  AddressInfo: AddressInfo;
  Connections: Connection[];
};

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
      countryId,
      maxResults: 10e8,
    },
    headers: {
      'X-API-Key': env.OPENCHARGEMAP_API_KEY,
    },
  });

  const poiList = response.data as POI[];

  return poiList;
};

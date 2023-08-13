import type * as MUUID from 'uuid-mongodb';

import { type DatabaseCollections } from './repository/database';

export type POIListSnapshot = {
  _id: MUUID.MUUID;
  poiListIds: MUUID.MUUID[];
  countriesProcessed: number;
  isCompleted: boolean;
};

export type Repository = {
  collections: DatabaseCollections;
};

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

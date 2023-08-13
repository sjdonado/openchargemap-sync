import { faker } from '@faker-js/faker';

import { type POI } from '../../src/services/openChargeMap';

const AddressInfo = {
  ID: faker.number.int(),
  Description: faker.lorem.lines(1),
  AddressLine1: faker.location.streetAddress(),
  AddressLine2: faker.location.secondaryAddress(),
  Town: faker.location.city(),
  StateOrProvince: faker.location.state(),
  Postcode: faker.location.zipCode(),
  CountryID: faker.number.int(),
  Country: {
    ID: faker.number.int(),
    ISOCode: faker.location.countryCode(),
    ContinentCode: faker.location.countryCode(),
    Title: faker.lorem.lines(1),
  },
  Latitude: faker.number.float(),
  Longitude: faker.number.float(),
  ContactTelephone1: faker.phone.number(),
  ContactTelephone2: faker.phone.number(),
  ContactEmail: faker.internet.email(),
  AccessComments: faker.lorem.lines(1),
  RelatedURL: faker.internet.url(),
  Distance: faker.number.float(),
  DistanceUnit: faker.number.float(),
};

const generatePOI: () => POI = () => ({
  OperatorInfo: {
    ID: faker.number.int(),
    description: faker.lorem.lines(1),
    WebsiteURL: faker.internet.url(),
    Comments: faker.lorem.lines(1),
    PhonePrimaryContact: faker.phone.number(),
    PhoneSecondaryContact: faker.phone.number(),
    IsPrivateIndividual: faker.datatype.boolean(),
    AddressInfo,
    BookingURL: faker.internet.url(),
    ContactEmail: faker.internet.email(),
    FaultReportEmail: faker.internet.email(),
    IsRestrictedEdit: faker.datatype.boolean(),
  },
  StatusType: {
    ID: faker.number.int(),
    description: faker.lorem.lines(1),
    IsOperational: faker.datatype.boolean(),
    IsUserSelectable: faker.datatype.boolean(),
  },
  AddressInfo,
  Connections: [
    {
      ID: faker.number.int(),
      ConnectionTypeID: faker.number.int(),
      ConnectionType: {
        ID: faker.number.int(),
        title: faker.lorem.lines(1),
        FormalName: faker.lorem.lines(1),
        IsDiscontinued: faker.datatype.boolean(),
        IsObsolete: faker.datatype.boolean(),
      },
      Reference: faker.lorem.lines(1),
      StatusTypeID: faker.number.int(),
      StatusType: {
        ID: faker.number.int(),
        description: faker.lorem.lines(1),
        IsOperational: faker.datatype.boolean(),
        IsUserSelectable: faker.datatype.boolean(),
      },
      LevelID: faker.number.int(),
      Level: {
        ID: faker.number.int(),
      },
      Amps: faker.number.float(),
      Voltage: faker.number.float(),
      PowerKW: faker.number.float(),
      CurrentTypeID: faker.number.int(),
      CurrentType: {
        ID: faker.number.int(),
      },
      Quantity: faker.number.float(),
      Comments: faker.lorem.lines(1),
    },
  ],
});

export const generatePOIList = (items = 1) =>
  Array(items)
    .fill({})
    .map(() => generatePOI());

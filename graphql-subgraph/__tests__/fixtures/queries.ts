export const getPois = `#graphql
  query GetPois($first: Int, $after: String, $last: Int, $before: String) {
    pois(first: $first, after: $after, last: $last, before: $before) {
      edges {
        cursor
        node {
          OperatorInfo {
            ID
            description
            WebsiteURL
            Comments
            PhonePrimaryContact
            PhoneSecondaryContact
            IsPrivateIndividual
            BookingURL
            ContactEmail
            FaultReportEmail
            IsRestrictedEdit
            AddressInfo {
              ID
              Description
              AddressLine1
              AddressLine2
              Town
              StateOrProvince
              Postcode
              CountryID
              Country {
                ID
                ISOCode
                ContinentCode
                Title
              }
              Latitude
              Longitude
              ContactTelephone1
              ContactTelephone2
              ContactEmail
              AccessComments
              RelatedURL
              Distance
              DistanceUnit
            }
          }
          StatusType {
            ID
            description
            IsOperational
            IsUserSelectable
          }
          AddressInfo {
            ID
            Description
            AddressLine1
            AddressLine2
            Town
            StateOrProvince
            Postcode
            CountryID
            Country {
              ID
              ISOCode
              ContinentCode
              Title
            }
            Latitude
            Longitude
            ContactTelephone1
            ContactTelephone2
            ContactEmail
            AccessComments
            RelatedURL
            Distance
            DistanceUnit
          }
          Connections {
            ID
            ConnectionTypeID
            ConnectionType {
              ID
              title
              FormalName
              IsDiscontinued
              IsObsolete
            }
            Reference
            StatusTypeID
            LevelID
            Level {
              ID
              Title
              Comments
              IsFastChargeCapable
            }
            Amps
            Voltage
            PowerKW
            CurrentTypeID
            CurrentType {
              ID
              Title
            }
            Quantity
            Comments
            StatusType {
              ID
              description
              IsOperational
              IsUserSelectable
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const getPoisNoPagination = `#graphql
  query GetPoisNoPagination {
    pois {
      edges {
        cursor
        node {
          OperatorInfo {
            ID
            description
            WebsiteURL
            Comments
            PhonePrimaryContact
            PhoneSecondaryContact
            IsPrivateIndividual
            BookingURL
            ContactEmail
            FaultReportEmail
            IsRestrictedEdit
            AddressInfo {
              ID
              Description
              AddressLine1
              AddressLine2
              Town
              StateOrProvince
              Postcode
              CountryID
              Country {
                ID
                ISOCode
                ContinentCode
                Title
              }
              Latitude
              Longitude
              ContactTelephone1
              ContactTelephone2
              ContactEmail
              AccessComments
              RelatedURL
              Distance
              DistanceUnit
            }
          }
          StatusType {
            ID
            description
            IsOperational
            IsUserSelectable
          }
          AddressInfo {
            ID
            Description
            AddressLine1
            AddressLine2
            Town
            StateOrProvince
            Postcode
            CountryID
            Country {
              ID
              ISOCode
              ContinentCode
              Title
            }
            Latitude
            Longitude
            ContactTelephone1
            ContactTelephone2
            ContactEmail
            AccessComments
            RelatedURL
            Distance
            DistanceUnit
          }
          Connections {
            ID
            ConnectionTypeID
            ConnectionType {
              ID
              title
              FormalName
              IsDiscontinued
              IsObsolete
            }
            Reference
            StatusTypeID
            LevelID
            Level {
              ID
              Title
              Comments
              IsFastChargeCapable
            }
            Amps
            Voltage
            PowerKW
            CurrentTypeID
            CurrentType {
              ID
              Title
            }
            Quantity
            Comments
            StatusType {
              ID
              description
              IsOperational
              IsUserSelectable
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

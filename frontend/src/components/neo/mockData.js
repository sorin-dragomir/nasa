// Mock NEO data for testing when API is not available
export const mockNeoData = {
  "links": {
    "next": "http://www.neowsapp.com/rest/v1/feed?start_date=2025-07-05&end_date=2025-07-05&detailed=false&api_key=DEMO_KEY",
    "prev": "http://www.neowsapp.com/rest/v1/feed?start_date=2025-07-03&end_date=2025-07-03&detailed=false&api_key=DEMO_KEY",
    "self": "http://www.neowsapp.com/rest/v1/feed?start_date=2025-07-04&end_date=2025-07-04&detailed=false&api_key=DEMO_KEY"
  },
  "element_count": 8,
  "near_earth_objects": {
    "2025-07-04": [
      {
        "links": {
          "self": "http://www.neowsapp.com/rest/v1/neo/3542519?api_key=DEMO_KEY"
        },
        "id": "3542519",
        "neo_reference_id": "3542519",
        "name": "(2010 JO69)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3542519",
        "absolute_magnitude_h": 21.3,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.1182972328,
            "estimated_diameter_max": 0.2644668478
          },
          "meters": {
            "estimated_diameter_min": 118.2972327512,
            "estimated_diameter_max": 264.4668477847
          }
        },
        "is_potentially_hazardous_asteroid": false,
        "close_approach_data": [
          {
            "close_approach_date": "2025-07-04",
            "close_approach_date_full": "2025-Jul-04 18:22",
            "epoch_date_close_approach": 1751742120000,
            "relative_velocity": {
              "kilometers_per_second": "8.0392579849",
              "kilometers_per_hour": "28941.3287456064",
              "miles_per_hour": "17983.0950517321"
            },
            "miss_distance": {
              "astronomical": "0.4856548193",
              "lunar": "188.8597251077",
              "kilometers": "72659104.318991891",
              "miles": "45147104.0766427758"
            },
            "orbiting_body": "Earth"
          }
        ],
        "is_sentry_object": false
      },
      {
        "links": {
          "self": "http://www.neowsapp.com/rest/v1/neo/2465633?api_key=DEMO_KEY"
        },
        "id": "2465633",
        "neo_reference_id": "2465633",
        "name": "465633 (2009 JR5)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2465633",
        "absolute_magnitude_h": 20.84,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.1349455359,
            "estimated_diameter_max": 0.3017314753
          },
          "meters": {
            "estimated_diameter_min": 134.9455358982,
            "estimated_diameter_max": 301.7314752652
          }
        },
        "is_potentially_hazardous_asteroid": true,
        "close_approach_data": [
          {
            "close_approach_date": "2025-07-04",
            "close_approach_date_full": "2025-Jul-04 23:38",
            "epoch_date_close_approach": 1751761080000,
            "relative_velocity": {
              "kilometers_per_second": "6.1231456789",
              "kilometers_per_hour": "22043.3244404000",
              "miles_per_hour": "13697.2834567890"
            },
            "miss_distance": {
              "astronomical": "0.0234567890",
              "lunar": "9.1234567890",
              "kilometers": "3507890.123456789",
              "miles": "2179456.789012345"
            },
            "orbiting_body": "Earth"
          }
        ],
        "is_sentry_object": false
      },
      {
        "links": {
          "self": "http://www.neowsapp.com/rest/v1/neo/54016050?api_key=DEMO_KEY"
        },
        "id": "54016050",
        "neo_reference_id": "54016050",
        "name": "(2020 QG5)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=54016050",
        "absolute_magnitude_h": 25.2,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.0211234567,
            "estimated_diameter_max": 0.0472345678
          },
          "meters": {
            "estimated_diameter_min": 21.1234567890,
            "estimated_diameter_max": 47.2345678901
          }
        },
        "is_potentially_hazardous_asteroid": false,
        "close_approach_data": [
          {
            "close_approach_date": "2025-07-04",
            "close_approach_date_full": "2025-Jul-04 12:15",
            "epoch_date_close_approach": 1751720100000,
            "relative_velocity": {
              "kilometers_per_second": "15.2345678901",
              "kilometers_per_hour": "54844.4444044000",
              "miles_per_hour": "34067.8901234567"
            },
            "miss_distance": {
              "astronomical": "0.1234567890",
              "lunar": "48.0234567890",
              "kilometers": "18467890.123456789",
              "miles": "11479456.789012345"
            },
            "orbiting_body": "Earth"
          }
        ],
        "is_sentry_object": false
      }
    ],
    "2025-07-03": [
      {
        "links": {
          "self": "http://www.neowsapp.com/rest/v1/neo/3791865?api_key=DEMO_KEY"
        },
        "id": "3791865",
        "neo_reference_id": "3791865",
        "name": "(2017 SQ2)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3791865",
        "absolute_magnitude_h": 22.1,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.0887654321,
            "estimated_diameter_max": 0.1987654321
          },
          "meters": {
            "estimated_diameter_min": 88.7654321098,
            "estimated_diameter_max": 198.7654321098
          }
        },
        "is_potentially_hazardous_asteroid": false,
        "close_approach_data": [
          {
            "close_approach_date": "2025-07-03",
            "close_approach_date_full": "2025-Jul-03 14:30",
            "epoch_date_close_approach": 1751634600000,
            "relative_velocity": {
              "kilometers_per_second": "12.3456789012",
              "kilometers_per_hour": "44444.4444044000",
              "miles_per_hour": "27600.1234567890"
            },
            "miss_distance": {
              "astronomical": "0.0987654321",
              "lunar": "38.4234567890",
              "kilometers": "14767890.123456789",
              "miles": "9179456.789012345"
            },
            "orbiting_body": "Earth"
          }
        ],
        "is_sentry_object": false
      },
      {
        "links": {
          "self": "http://www.neowsapp.com/rest/v1/neo/2099942?api_key=DEMO_KEY"
        },
        "id": "2099942",
        "neo_reference_id": "2099942",
        "name": "99942 Apophis (2004 MN4)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2099942",
        "absolute_magnitude_h": 19.7,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.2134567890,
            "estimated_diameter_max": 0.4776543210
          },
          "meters": {
            "estimated_diameter_min": 213.4567890123,
            "estimated_diameter_max": 477.6543210987
          }
        },
        "is_potentially_hazardous_asteroid": true,
        "close_approach_data": [
          {
            "close_approach_date": "2025-07-03",
            "close_approach_date_full": "2025-Jul-03 08:45",
            "epoch_date_close_approach": 1751614500000,
            "relative_velocity": {
              "kilometers_per_second": "7.8901234567",
              "kilometers_per_hour": "28404.4444444000",
              "miles_per_hour": "17649.8765432109"
            },
            "miss_distance": {
              "astronomical": "0.0156789012",
              "lunar": "6.0987654321",
              "kilometers": "2345678.901234567",
              "miles": "1457890.123456789"
            },
            "orbiting_body": "Earth"
          }
        ],
        "is_sentry_object": true
      }
    ]
  }
};

export const mockAsteroids = [
  {
    "id": "3542519",
    "name": "(2010 JO69)",
    "approach_date": "2025-07-04",
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 0.1182972328,
        "estimated_diameter_max": 0.2644668478
      }
    },
    "is_potentially_hazardous_asteroid": false,
    "close_approach_data": [
      {
        "close_approach_date": "2025-07-04",
        "close_approach_date_full": "2025-Jul-04 18:22",
        "relative_velocity": {
          "kilometers_per_hour": "28941.3287456064"
        },
        "miss_distance": {
          "kilometers": "72659104.318991891"
        }
      }
    ]
  },
  {
    "id": "2465633",
    "name": "465633 (2009 JR5)",
    "approach_date": "2025-07-04",
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 0.1349455359,
        "estimated_diameter_max": 0.3017314753
      }
    },
    "is_potentially_hazardous_asteroid": true,
    "close_approach_data": [
      {
        "close_approach_date": "2025-07-04",
        "close_approach_date_full": "2025-Jul-04 23:38",
        "relative_velocity": {
          "kilometers_per_hour": "22043.3244404000"
        },
        "miss_distance": {
          "kilometers": "3507890.123456789"
        }
      }
    ]
  },
  {
    "id": "54016050",
    "name": "(2020 QG5)",
    "approach_date": "2025-07-04",
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 0.0211234567,
        "estimated_diameter_max": 0.0472345678
      }
    },
    "is_potentially_hazardous_asteroid": false,
    "close_approach_data": [
      {
        "close_approach_date": "2025-07-04",
        "close_approach_date_full": "2025-Jul-04 12:15",
        "relative_velocity": {
          "kilometers_per_hour": "54844.4444044000"
        },
        "miss_distance": {
          "kilometers": "18467890.123456789"
        }
      }
    ]
  },
  {
    "id": "3791865",
    "name": "(2017 SQ2)",
    "approach_date": "2025-07-03",
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 0.0887654321,
        "estimated_diameter_max": 0.1987654321
      }
    },
    "is_potentially_hazardous_asteroid": false,
    "close_approach_data": [
      {
        "close_approach_date": "2025-07-03",
        "close_approach_date_full": "2025-Jul-03 14:30",
        "relative_velocity": {
          "kilometers_per_hour": "44444.4444044000"
        },
        "miss_distance": {
          "kilometers": "14767890.123456789"
        }
      }
    ]
  },
  {
    "id": "2099942",
    "name": "99942 Apophis (2004 MN4)",
    "approach_date": "2025-07-03",
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 0.2134567890,
        "estimated_diameter_max": 0.4776543210
      }
    },
    "is_potentially_hazardous_asteroid": true,
    "close_approach_data": [
      {
        "close_approach_date": "2025-07-03",
        "close_approach_date_full": "2025-Jul-03 08:45",
        "relative_velocity": {
          "kilometers_per_hour": "28404.4444444000"
        },
        "miss_distance": {
          "kilometers": "2345678.901234567"
        }
      }
    ]
  }
];

// scripts/config.js

/**
 * Application-wide configuration file.
 * This file centralizes settings like API endpoints, default values,
 * and lists of common places to make them easily manageable.
 */

// We use 'export default' to make this configuration object easily importable
// into other JavaScript files.
export default {
  /**
   * A list of common destinations, primarily universities, for the commute calculator.
   * Each object should have a 'name' for the button label and an 'address'
   * that is a full, queryable string for the Google Directions API.
   */
  commonDestinations: [
    {
      name: 'UTS',
      address: '15 Broadway, Ultimo NSW 2007, Australia'
    },
    {
      name: 'USYD',
      address: 'The University of Sydney, Camperdown NSW 2006, Australia'
    },
    {
      name: 'UNSW',
      address: 'UNSW Sydney, High Street, Kensington NSW 2052, Australia'
    },
    {
      name: 'Macquarie Uni',
      address: 'Macquarie University, Macquarie Park NSW 2109, Australia'
    }
  ]
};

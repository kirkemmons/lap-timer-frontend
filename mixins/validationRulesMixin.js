export default {
  data () {
    return {
      valid: false,
      rules: {
        required: value => !!value || 'Required',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return (!value || pattern.test(value)) || 'Invalid e-mail'
        },
        max (maxChars) {
          return v => (v || '').length <= maxChars || `Must be less than ${maxChars} characters`
        },
        lessThan60: value => value.length <= 60 || 'Max 60 characters',
        lessThan320: value => value.length <= 320 || 'Max 320 characters',
        isPositiveNumber: (value) => {
          const pattern = /^[+]?\d+([.]\d+)?$/
          return (!value || pattern.test(value)) || 'Must be a positive Number'
        },
        isNumber: (value) => {
          const pattern = /^\d+$/
          return (!!value || pattern.test(value)) || 'Must be a Number'
        },
        isMatch: v => (!!v && v) === this.match || 'Values do not match',
        isEightCharacters: v => v.length >= 8 || 'Must be at least 8 characters',
        includesNumber: (value) => {
          const pattern = /\d/
          return (!value || pattern.test(value)) || 'Must include a number'
        },
        includesSymbol: (value) => {
          const pattern = /[$@#%&+=*-/:-?{-~!"^_`[\]]/
          return (!value || pattern.test(value)) || 'Must include a symbol'
        },
        includesUppercase: (value) => {
          const pattern = /[A-Z]/
          return (!value || pattern.test(value)) || 'Must include an uppercase letter'
        },
        includesLowercase: (value) => {
          const pattern = /[a-z]/
          return (!value || pattern.test(value)) || 'Must include a lowercase letter'
        },
        isPhoneNumber: (value) => {
          const pattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
          return (!value || pattern.test(value)) || 'Must be a valid phone number'
        }
      },
      states: [
        'Alabama', 'Alaska', 'American Samoa', 'Arizona',
        'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'District of Columbia', 'Federated States of Micronesia',
        'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Marshall Islands', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
        'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
        'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia',
        'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
      ],
      statesAbbreviated: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ]
    }
  }
}

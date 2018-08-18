const AppConstants = {
  // api: 'http://localhost:3000/api',
  // api: 'http://localhost:3000', 
  api: '0.0.0.0:3000',
  // api: 'https://todo-tomatoinator-mrieser100.c9users.io',
  jwtKey: 'jwtToken',
  appName: 'Todo-Tomatoinator',
  apiKeys: {
    wordnik: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5' // TODO: replace with your key!
  },
  oneHourInMilliseconds: 36000000,
  twelveHoursInMilliseconds: 43200000,
  dayInMilliseconds: 86400000,
  businessWeekInMilliseconds: 432000000,
  pomTimerData: { // TODO: could dynamically load this from user settings in tasks route
      'pom': 25, 
      'shortBrk': 5,
      'longBrk': 10
  }
};

export default AppConstants;

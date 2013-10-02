var SLIDE_CONFIG = {
  // Slide settings
  settings: {
    title: 'WebRTC',
    subtitle: 'Plugin-free realtime communication',
    eventTitle: '',
    useBuilds: true, // Default: true. False will turn off slide animation builds.
    usePrettify: true, // Default: true
    enableSlideAreas: true, // Default: true. False turns off the click areas on either slide of the slides.
    enableTouch: true, // Default: true. If touch support should enabled. Note: the device must support touch.
    analytics: 'UA-2630780-1', // TODO: Using this breaks GA for some reason (probably requirejs). Update your tracking code in template.html instead.
    favIcon: 'images/google_developers_logo_tiny.png',
    fonts: [
      'Open Sans:regular,semibold,italic,italicsemibold',
      'Source Code Pro'
    ],
    theme: ['sam'], // Add your own custom themes or styles in /theme/css. Leave off the .css extension.
  },

  // Author information
  presenters: [{
    name: 'Justin Uberti',
    company: 'WebRTC Tech Lead, Google',
    gplus: 'https://plus.google.com/103619602351433955946/posts',
    twitter: '@juberti',
/*    www: 'http://www.you.com', */
    github: 'https://github.com/juberti'
  },
  {
    name: 'Sam Dutton',
    company: 'Developer Advocate, Google Chrome',
    gplus: 'http://plus.samdutton.com',
    twitter: '@sw12',
    www: 'http://www.samdutton.com',
    github: 'http://github.com/samdutton'
  }]
};


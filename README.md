# Pri(n)ce notifier

Basically this app is just to notify the users using native notifications about the change of a price from a provider, this is being done using Electron + React.js, with this basic setup a some components you can configure how to get the desired notifications.

# Images

# Usage

the way how this app works is very simple, you just need to add some providers and the paths of the values that you want and set the desired time of the notifications.

1. when adding a provider you will need to fill the following parameters
   a) Name: name of the provider, it will be shown on the notifications so you can identify the price
   b) Min (slider): later when configuring the min price to show the notification you will have an slider, with this you can define the min value of the slider
   c) Max(slider): idem, the only change is that it will be the max value ;)
   d) Step(slider): the step that the values change on the slider
   e) endpoint: url to get the values, the response should be a `json`
   f) route to value: this is the route to the value that you need to be compared. basically it can be a string to an inner value of the object, it supports arrays and nested objects, on the examples section you can find examples.

2. after adding a new provider, its status will be defaulted to off, this means that this provider will save values to the historic but it wont trigger any desktop notifications,

3. when opening using the down arrow, you can see that you can configure in a slider the value that will define if you get a notification about a prive being higher than yours.
4. besides the `Tickers` title you can find a gear that will open an input, this input defines the time(in ms) to fetch the data, the default value is 0, it is recommended to use `1800000` (30 minutes), because some endpoints can momentarily ban you to get some values, this will be reflected on the historic table
5. that is all, with that you can close the app and get the notifications about the prices. along with this, you can find a tray icon to show the app or quit it.

# How to install

1. you need to have installed `node` and `yarn`,but `npm` is also supported.
2. clone the repo
3. `yarn install` or `npm install`
4. `yarn start` or `npm run start`
5. this will generate a database in the `/public` folder
6. the app is running, you can close the app and a tray icon will appear, you can bring the app to the front again or close it

# Suggestions/Bugs

suggestions can be made using `issues` or by email.

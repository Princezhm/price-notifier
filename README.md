# Pri(n)ce notifier

Basically this app is just to notify the users using native notifications about the change of a price from a provider, this is not hardcoded to any provider, if you can get an url and the route to the desired value, you can put it in here and it will return the value that you want.
This project has been created with Electron + React.js + Material-ui. With this basic setup a some components you can configure how to get the desired notifications.

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

# Examples

lets take this following cases:

### 1) BuenBit:

using the url `https://be.buenbit.com/api/market/tickers/` the response of **buenbit** is:

```
{
   "object":{
      "daiars":{
         "currency":"ARS",
         "bid_currency":"dai",
         "ask_currency":"ars",
         "purchase_price":"156.0",
         "selling_price":"160.6",
         "market_identifier":"daiars"
      },
   .....
   "errors":[

   ]
}
```

and we need the `purchase_price` of this, then what we need to add in the `route to value` is `object.daiars.purchase_price` which will give us the value of `156`, it is important to notice if the endpoint or structure of the json changes, because we will see an error on the historic table and the notifications about not getting the value using the route.

### 2) Satoshi Tango:

the url of satoshi tango is `https://api.satoshitango.com/v3/ticker/ALL` and their response is:

```
{
   "data":{
      "ticker":{
         "ARS":{
            ...
            ...
            "DAI":{
               "date":"2021-05-02 00:53:03",
               "timestamp":1619916783,
               "bid":153.47999,
               "ask":160.91999,
               "high":0,
               "low":0,
               "volume":0
            },
            ...
            ...
         }
      },
      "code":"success"
   }
}
```

so the route of the `bid` value which we want is: `data.ticket.ARS.DAI.bid` which will result in a value of `153.47999`

### 2) Dolar Azul (Ambito):

the url that we want for the dolar azul is `https://mercados.ambito.com//dolar/informal/variacion` and the response is :

```
{
   "compra":"145,00",
   "venta":"150,00",
   "fecha":"30\/04\/2021 - 16:11",
   "variacion":"-2,60%",
   "class-variacion":"down"
}
```

which is very simple, because just adding `compra` to the route to value will get the desired value.

### 3) Anything:

well not anything but you can play and find endpoints of different assets that you want to follow, the idea is that you can customize when to get your notifications and find if it going up or down (not getting any notifications LOL), some ideas are `trading view`, `changelly` and `criptos.com.ar`.
if you want to help by adding one endpoint and its respective path, it is a great help (also applies to update endpoints)

# Suggestions/Bugs

suggestions can be made using `issues` or by email.

# Images

<img width="802" alt="Screen Shot 2021-05-01 at 17 05 55" src="https://user-images.githubusercontent.com/8930664/116798491-47378700-aac6-11eb-95d4-696a40f320e4.png">

<img width="456" alt="Screen Shot 2021-05-01 at 17 09 25" src="https://user-images.githubusercontent.com/8930664/116798492-49014a80-aac6-11eb-82e9-35b4af6df99a.png">
<img width="609" alt="Screen Shot 2021-05-01 at 17 09 43" src="https://user-images.githubusercontent.com/8930664/116798493-4999e100-aac6-11eb-8423-8de032f4655b.png">
<img width="540" alt="Screen Shot 2021-05-01 at 17 12 06" src="https://user-images.githubusercontent.com/8930664/116798494-4acb0e00-aac6-11eb-9802-1f11b6f277f8.png">
<img width="103" alt="Screen Shot 2021-05-01 at 17 13 04" src="https://user-images.githubusercontent.com/8930664/116798495-4b63a480-aac6-11eb-967f-2398123e6cc7.png">
<img width="451" alt="Screen Shot 2021-05-01 at 17 14 16" src="https://user-images.githubusercontent.com/8930664/116798496-4bfc3b00-aac6-11eb-8b66-a45b4d5eb68d.png">
<img width="922" alt="Screen Shot 2021-05-01 at 17 14 20" src="https://user-images.githubusercontent.com/8930664/116798497-4c94d180-aac6-11eb-8d5b-8837e1350039.png">

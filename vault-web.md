# Data-Fornix-Web Vault SDK

## Overview

This SDK provide you storage and sharing features in miscellaneous aspects:
- Provided you the list of all your uploaded assets.
- Provide access of any assets to person/ organisation with email address and upto a time period.
- Show the list of assets those are shared to you.
- Show the list of shared asset by you.
- Provide you a list of access request(by any orgs or any person). which you can grant or deny.

Note: the SDK is only responsible for display assets. You still need to access the [DataFornix API](https://github.com/anandramdeo-df/df-web-api-sdk) to manage applicants and checks.

## Getting started

### 1. Obtaining an SDK token

In order to start integration, you will need the **SDK token**.

### 2. Including/Importing the library

#### 2.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/data-fornix-web-vault.js'></script>
```

#### 2.2 NPM style import

You can also import it as a module into your own JS build system.


```sh
$ npm install --save data-fornix-web-vault
```

```js
// ES6 module import
import DataFornixWebVault from 'data-fornix-web-vault'

// commonjs style require
var DataFornixWebVault = require('data-fornix-web-vault')
```

### 3. Adding basic HTML markup

There is only one element required in your HTML, an empty element for the modal interface to mount itself on:

```html
<!-- you need an empty element where the verification component will be mounted. -->
<div id='data-fornix-vault'></div>
```

### 4. Render SDK

Now you are ready to use vault SDK.

```js
// Create instance of DataFornix Vault SDK
// and store it in `dataFornixVaultObj` for future use
new DataFornixVault({
		// the SDK token
		token: '<YOUR_SDK_TOKEN>',
		// id of the element you want to mount the component on
		containerId: 'data-fornix-vault',
		type: '<Vault Type>',
		data: '[ ]', // Asset list data
		styles: '{  }', // Your custom style in string format
		onComplete: function (type, data) {
			// onComplete function that return
			// performed action type and data
			// using type, you can take action on data
		}
});
```

By Vault SDK we are showing different type list of assets and handling many  actions that performed on asset. To manage all these things we are using type key.
You can choose among 7 different type which you want to show, and it will show the respected screen:

Type |  Use for |
------------ | ------------ |
asset |  use for display uploaded asset list and relative actions |
shared | use for display shared asset list and relative actions   |
request | use for display list of organization request for single asset and relative actions   |
request-all | use for display list of organization request for all asset and relative actions   |
upload | use for display list of upload asset request relative actions   |

#### Handling callbacks
- **`onComplete {Function}`**

onComplete callback that fires when any action trigger by user on asset. 
The onComplete returns action type and data.
At this point you can use DataFornix API SDK according action type and data.

You will receive following **Action Type**

Action Type |  Received when |
------------ | ------------ |
asset-edit |  received when user submit asset edit form  |
asset-delete | action received when user click asset delete action   |
revoke | action received when user click on revoke asset button   |
shared-time-update | action received when user send request for update shared time of asset   |
request-deny | action received when user deny asset shared request   |
request-allow | action received when user allow asset shared request   |
request-all-deny | action received when user deny all asset shared request   |
request-all-allow | action received when user allow all asset shared request   |
upload | action received when user request for upload asset   |

## Customising SDK

A number of options are available to allow you to customise the SDK UI:

- **`token {String} required`**

  A SDK Token is required in order to authorise. If one isn’t present, an exception will be thrown.

- **`containerId {String} required`**

  A string of the ID of the container element that the UI will mount to. This needs to be an empty element.

- **`type {String} required`**

  Vault Type is use to identify which type of asset list you want to show. According provided type it will show action buttons.

- **`data {Array} required`**
  Asset Data that you want to show in SDK.

- **`styles {String} optional`**
  To update SDK UI according your current app theme you can pass your own style in string format. SDK will overwrite existing style with your provided style.
  
Example to use `styles`

 ```javascript
const style = `{
     button.btn {
        background-color: #4CAF50;
    }
    .table-basic {
        background-color: #fff;
    }
 }`;
const data = [];

new DataFornixVault({
		// the SDK token
		token: '<YOUR_SDK_TOKEN>',
		// id of the element you want to mount the component on
		containerId: 'data-fornix-vault',
		type: 'asset',
		data: data,
		styles: style,
		onComplete: function (type, data) {
		}
});
```

## More information

### Browser compatibility

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- |
Latest ✔ | Latest ✔ | 11+ ✔ | Latest ✔ |

### Support

Please open an issue through [GitHub](https://github.com/anandramdeo-df/DF-ReadMes/issues). Please be as detailed as you can. Remember **not** to submit your token in the issue. Also check the closed issues to check whether it has been previously raised and answered.

Previous version of the SDK will be supported for a month after a new major version release. Note that when the support period has expired for an SDK version, no bug fixes will be provided, but the SDK will keep functioning (until further notice).

## How is the DataFornix SDK licensed?

The DataFornix SDK are available under the MIT license.
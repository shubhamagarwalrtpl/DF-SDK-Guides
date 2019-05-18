# Data-Fornix-Web Selfie Check SDK

* [Overview](#overview)
* [Getting started](#getting-started)
* [Handling callbacks](#handling-callbacks)
* [Removing SDK](#removing-sdk)
* [Customising SDK](#customising-sdk)
* [More information](#more-information) 

## Overview

This SDK provides functionality to capturing user selfie using native camera for the purpose of user verification. The SDK offers following benefits:

- Configurable UI to help you to set SDK looks according your current app theme
- Carefully designed UI to guide your customers through the entire selfie-capturing process
- Direct image upload to the DataFornix service, to simplify integration*

*Note: the SDK is only responsible for capturing selfie. You still need to access the [DataFornix API](https://github.com/anandramdeo-df/df-web-api-sdk) to manage applicants and checks.

## Getting started

### 1. Obtaining an SDK token

In order to start integration, you will need the **SDK token**.

### 2. Including/Importing the library

#### 2.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/data-fornix-web-selfie-check.js'></script>
```

#### 2.2 NPM style import

You can also import it as a module into your own JS build system (tested with Webpack).


```sh
$ npm install --save data-fornix-web-selfie-check
```

```js
// ES6 module import
import DataFornixSelfieCheck from 'data-fornix-web-selfie-check'

// commonjs style require
var DataFornixSelfieCheck = require('data-fornix-web-selfie-check')
```

#### Notice

The library is **Browser only**, it does not support the **Node Context**.

### 3. Adding basic HTML markup

There is only one element required in your HTML, an empty element for the modal interface to mount itself on:

```html
<!-- At the bottom of your page, you need an empty element where the
verification component will be mounted. -->
<div id='selfie-check-element'></div>
```

### 4. Initialising the SDK

You are now ready to initialise the SDK:

```js
// Create instance of DataFornix Selfie Check SDK
// and store it in `dataFornixSelfieCheckObj` for future use
const dataFornixSelfieCheckObj = new DataFornixSelfieCheck({
    // the SDK token
    token: 'YOUR_SDK_TOKEN',
    // id of the element you want to mount the component on
    containerId: 'selfie-check-element',
    onComplete: function (data) {
        // onComplete function that return you uploaded selfie
        // you can get capture selfie in `data.profile_pic`
    }
});
```

Congratulations! You have successfully started the flow. Carry on reading the next sections to learn how to:

- Handle callbacks
- Remove SDK previous state (if using single page application)
- Customise the SDK UI and use other usefull configuration

## Handling callbacks

- **`onComplete {Function}`**

  onComplete callback that fires when the selfie successfully been captured.
  At this point you can use DataFornix API SDK to save selfie image to server. [DataFornix API SDK](https://github.com/anandramdeo-df/df-web-api-sdk).
  The onComplete returns selfie image (as formdata object). The data will be formatted as follow:  
  `{profile_pic: SELFIE_FILE_OBJECT}`.

  Here is an `onComplete` example:

  ```js  
  const dataFornixSelfieCheckObj = new DataFornixSelfieCheck({
    token: 'YOUR_SDK_TOKEN',
    containerId: 'selfie-check-element',
    onComplete: selfieCheckCallback
  });

  function selfieCheckCallback(data) {
    const response = {
        'profile_pic': data.profile_pic
    };
  }
  ```

## Removing SDK

If you are embedding the SDK inside a single page app, you can call the `clearState` function to remove the SDK complelety from the current webpage. It will reset state and you can safely re-initialise the SDK inside the same webpage later on.

```javascript
const dataFornixSelfieCheckObj = new DataFornixSelfieCheck({...})
...
if (this.dataFornixSelfieCheckObj) {
    this.dataFornixSelfieCheckObj.clearState();
}
```

## Customising SDK

A number of options are available to allow you to customise the SDK UI:

- **`token {String} required`**

  A SDK Token is required in order to authorise. If one isn’t present, an exception will be thrown.

- **`containerId {String} optional`**

  A string of the ID of the container element that the UI will mount to. This needs to be an empty element. The default ID is `root`.

- **`styles {String} optional`**
  To update SDK UI according your current app theme you can pass your own style in string format. SDK will overwrite existing style with your provided style.
  
Example to use `styles`

 ```js
    const style = `{
        .selfieMain {
            background-color: lightgray;
        }
        .selfieMain button.btn {
            background-color: #4CAF50;
        }
    }`;

     const dataFornixSelfieCheckObj = new DataFornixSelfieCheck({
        token: 'YOUR_SDK_TOKEN',
        containerId: 'selfie-check-element',
        styles: style,
        onComplete: selfieCheckCallback
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

## How is the DataFornix Selfie Check SDK licensed?

The DataFornix Selfie Check SDK are available under the MIT license.
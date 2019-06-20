# Data-Fornix-Web Video Liveliness SDK

* [Overview](#overview)
* [Getting started](#getting-started)
* [Handling callbacks](#handling-callbacks)
* [Removing SDK](#removing-sdk)
* [Customising SDK](#customising-sdk)
* [More information](#more-information) 

## Overview

This SDK provides functionality to capture a short video of user using native camera for the purpose of user verification. Captured video could be sent to *Datafornix Server* to check if the face in the video matches with the user's selfie or photo that extracted from identity document.

*Note: the SDK is only responsible for capturing video. You still need to access the [DataFornix API](https://github.com/anandramdeo-df/df-web-api-sdk) to manage applicants and checks.

## Getting started

### 1. Obtaining an SDK token

In order to start integration, you will need the **SDK token**.

### 2. Including/Importing the library

#### 2.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/data-fornix-web-video-liveliness.js'></script>
```

#### 2.2 NPM style import

You can also import it as a module into your own JS build system (tested with Webpack).


```sh
$ npm install --save data-fornix-web-video-liveliness
```

```js
// ES6 module import
import DataFornixVideo from 'data-fornix-web-video-liveliness'

// commonjs style require
var DataFornixVideo = require('data-fornix-web-video-liveliness')
```

#### Notice

The library is **Browser only**, it does not support the **Node Context**.

### 3. Adding basic HTML markup

There is only one element required in your HTML, an empty element for the modal interface to mount itself on:

```html
<!-- At the bottom of your page, you need an empty element where the
verification component will be mounted. -->
<div id='video-element'></div>
```

### 4. Initialising the SDK

You are now ready to initialise the SDK:

```js
// Create instance of DataFornix Video Liveliness SDK
// and store it in `DataFornixVideoObj` for future use
const DataFornixVideoObj = new DataFornixVideo({
    // the SDK token
    token: 'YOUR_SDK_TOKEN',
    // id of the element you want to mount the component on
    containerId: 'video-element',
    onComplete: function (data) {
        // onComplete function that return you uploaded video
        // you can get video valid status in `data.status`
        // and capture video in `data.profile_video` if `data.status` is `true`
    }
});
```

Congratulations! You have successfully started the flow. Carry on reading the next sections to learn how to:

- Handle callbacks
- Remove SDK previous state (if using single page application)
- Customise the SDK UI and use other usefull configuration

## Handling callbacks

- **`onComplete {Function}`**

  onComplete callback that fires when the video successfully been captured.
  At this point you can use DataFornix API SDK to save video to server. [DataFornix API SDK](https://github.com/anandramdeo-df/df-web-api-sdk).
  The onComplete returns video (as formdata object). The data will be formatted as follow:  
  `{profile_video: VIDEO_OBJECT, status: true/false}`.
  By `status` you can verify that captured video is valid or not
 
  ##### **Note:** You will receive video object only if **`status`** value is **`true`**.
  
  Here is an `onComplete` example:

  ```js  
  const DataFornixVideoObj = new DataFornixVideo({
    token: 'YOUR_SDK_TOKEN',
    containerId: 'video-element',
    onComplete: videoCallback
  });

  function videoCallback(data) {
    const response = {
        'status': data.status
        'profile_video': data.profile_video
    };
  }
  ```

## Removing SDK

If you are embedding the SDK inside a single page app, you can call the `clearState` function to remove the SDK complelety from the current webpage. It will reset state and you can safely re-initialise the SDK inside the same webpage later on.

```javascript
const DataFornixVideoObj = new DataFornixVideo({...})
...
if (this.DataFornixVideoObj) {
    this.DataFornixVideoObj.clearState();
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
        .videoMain {
            background-color: lightgray;
        }
        .videoMain button.btn {
            background-color: #ff0000;
        }

        .videoMain button.record-btn {
            background-color: green;
        }
    }`;

     const DataFornixVideoObj = new DataFornixVideo({
        token: 'YOUR_SDK_TOKEN',
        containerId: 'video-element',
        styles: style,
        onComplete: videoCallback
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

## How is the DataFornix Video Liveliness SDK licensed?

The DataFornix Video Liveliness SDK are available under the MIT license.
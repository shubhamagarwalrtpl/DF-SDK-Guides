# Data-Fornix-Web Document Cpature SDK

* [Overview](#overview)
* [Getting started](#getting-started)
* [Handling callbacks](#handling-callbacks)
* [Removing SDK](#removing-sdk)
* [Customising SDK](#customising-sdk)
* [More information](#more-information)

## Overview

This SDK provides a set of components for JavaScript applications to allow capturing of identity documents (by file upload or capture by camera) for the purpose of identity verification. The SDK offers a number of benefits to help you create the best onboarding / identity verification experience for your customers:

- Configurable UI to help you to set SDK looks according your current app theme
- Carefully designed UI to guide your customers through the entire photo-capturing process
- Direct image upload to the DataFornix service, to simplify integration*

Note: the SDK is only responsible for capturing photos. You still need to access the [DataFornix API](https://github.com/anandramdeo-df/df-web-api-sdk) to manage applicants and checks.

Users will be prompted to upload a file containing an image of their document. On handheld devices they can also use the native camera to take a photo of their document.

## Getting started

### 1. Obtaining an SDK token

In order to start integration, you will need the **SDK token**.

### 2. Including/Importing the library

#### 2.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/data-fornix-web-dc.js'></script>
```

#### 2.2 NPM style import

You can also import it as a module into your own JS build system (tested with Webpack).


```sh
$ npm install --save data-fornix-web-dc
```

```js
// ES6 module import
import DataFornixDC from 'data-fornix-web-dc'

// commonjs style require
var DataFornixDC = require('data-fornix-web-dc')
```

#### Notice

The library is **Browser only**, it does not support the **Node Context**.

### 3. Adding basic HTML markup

There is only one element required in your HTML, an empty element for the modal interface to mount itself on:

```html
<!-- At the bottom of your page, you need an empty element where the
verification component will be mounted. -->
<div id='data-fornix'></div>
```

### 4. Initialising the SDK

You are now ready to initialise the SDK:

```js
// Create instance of DataFornix Document Capture SDK
// and store it in `dataFornixWeb` for future use
const dataFornixWeb = new DataFornixDC({
    // the SDK token
    token: 'YOUR_SDK_TOKEN',
    // id of the element you want to mount the component on
    containerId: 'data-fornix',
    onComplete: function (data) {
        // onComplete function that return you uploaded documents
        // you can get uploaded documents in `data.frontFile`
        // and `data.backFile` if capturing document back
    }
});
```

Congratulations! You have successfully started the flow. Carry on reading the next sections to learn how to:

- Handle callbacks
- Remove SDK previous state (if using single page application)
- Customise the SDK UI and use other usefull configuration

## Handling callbacks

- **`onComplete {Function}`**

  onComplete callback that fires when the document successfully been uploaded.
  At this point you can use DataFornix API SDK to capture data from documents. [DataFornix API SDK](https://github.com/anandramdeo-df/df-web-api-sdk).
  The onComplete returns uploaded documents object. The data will be formatted as follow:  
  `{frontFile: FILE_OBJECT, backFile: FILE_OBJECT}`.

  Here is an `onComplete` example:

  ```js  
  const dataFornixWeb = new DataFornixDC({
    token: 'YOUR_SDK_TOKEN',
    containerId: 'data-fornix',
    onComplete: documentCaptureCallback
  });

  function documentCaptureCallback(data) {
    const capturedDocument = {
        'front_image': data.frontFile,
        'back_image': data.backFile
    };
  }
  ```

## Removing SDK

If you are embedding the SDK inside a single page app, you can call the `clearState` function to remove the SDK complelety from the current webpage. It will reset state and you can safely re-initialise the SDK inside the same webpage later on.

```javascript
const dataFornixWeb = new DataFornixDC({...})
...
dataFornixWeb.clearState()
```

## Customising SDK

A number of options are available to allow you to customise the SDK UI:

- **`token {String} required`**

  A SDK Token is required in order to authorise. If one isn’t present, an exception will be thrown.

- **`containerId {String} optional`**

  A string of the ID of the container element that the UI will mount to. This needs to be an empty element. The default ID is `root`.

- **`documentBackCapture {Boolean} optional`**

  Provide option to upload document both side (front and back) upload. The default ID is `false`.

- **`uiOptions {Object} optional`**
  You can updated UI of SDK according your current app theme. It has following options:-

Name | Type | Default | Description |
--- | --- | --- | --- |
isDraggabel | Boolean | true | Show file drag/drop option |
dragAreaWidth | Number | 160 | Set drag area width
dragAreaHight | Number | 125 | Set drag area hight
documentPreview | Boolean | true | Show document preview in drag area
useCamera | Boolean | true | Show option for capture image using native camera
firstInputTitle | String | Front of Document | Set title of first input
firstInputPlaceholder | String | Drag file here.. | Set placehoder for first input
secondInputTitle | String | Back of Document | Set title of second input
secondInputPlaceholder | String | Drag file here.. | Set placehoder for second input
borderColor | String | #949494 | Set border color |
fontSize | String | inherit | Set font size |
fontFamily | String | inherit | Set font family |
fontColor | String | inherit | Set font color |
backgroundColor | String | transparent | Set background color |

Example to use `uiOptions`
 ```javascript
 const dataFornixWeb = new DataFornixDC({
    token: 'YOUR_SDK_TOKEN',
    containerId: 'data-fornix',
    onComplete: documentCaptureCallback,
    uiOptions: {
        // drag options
        isDraggabel: true,
        dragAreaHight: 125,
        dragAreaWidth: 250,
        documentPreview: true,

        //input options
        firstInputTitle: 'Front of Licence',
        firstInputPlaceholder: 'Drag front of licence..',
        secondInputTitle: 'Back of Licence',
        secondInputPlaceholder: 'Drag back of licence..',

        //UI options
        borderColor: '#ccc',
        fontSize: 14,
        fontFamily: 'Raleway',
        buttonPrimaryColor: '#4CAF50',
        fontColor: '#333'
    }
  });
```

## More information

### Browser compatibility

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- |
Latest ✔ | Latest ✔ | 11+ ✔ | Latest ✔ |

### Support

Please open an issue through [GitHub](https://github.com/anandramdeo-df/df-web-document-capture-sdk/issues). Please be as detailed as you can. Remember **not** to submit your token in the issue. Also check the closed issues to check whether it has been previously raised and answered.

Previous version of the SDK will be supported for a month after a new major version release. Note that when the support period has expired for an SDK version, no bug fixes will be provided, but the SDK will keep functioning (until further notice).

## How is the DataFornix Document Capture SDK licensed?

The DataFornix Document Capture SDK are available under the MIT license.

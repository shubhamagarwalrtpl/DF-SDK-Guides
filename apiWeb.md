# Data-Fornix-Web API SDK

This Data-Fornix-Web API SDK provides a set of method's for JavaScript applications to verify user, capture and save data. 

## Getting Started

### 1. Obtaining an API token

In order to start integration, you will need the **API token**.

### 2. Including/Importing the library

#### 2.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/data-fornix-api.js'></script>
```

#### 2.2 NPM style import

You can also import it as a module into your own JS build system (tested with Webpack).


```sh
$ npm install --save data-fornix-api
```

```js
// ES6 module import
import DataFornixApi from 'data-fornix-api'

// commonjs style require
var DataFornixApi = require('data-fornix-api')
```

### 3. initializing the SDK

You are now ready to initialize the SDK:

```js
// Create instance of DataFornix Web API SDK
// and store it in `dataFornixAPIInstance` for future use
const dataFornixAPIInstance = new DataFornixApi(apiToken);
```

To verify that SDK is successfully initialized or not, you can pass callback function as second parameter

```js
const dataFornixAPIInstance = new DataFornixApi(
    apiToken,
    function (response) {
        console.log('api sdk ready to use', response);
    }
);
```

#### Parameters

Following parameters are using to initialize API SDK:

- **`apiToken {String} required`**

  A API Token is required in order to authorise. If one isn’t present, an exception will be thrown.

- **`callback {Function} optional`**

  Callback function that fires when the Api SDk successfully initialized.

## Documentation for API Endpoints

Method | Description
------------- | ------------- |
[**createUser**](docs/CreateUser.md) | This method is for get user details from database before other api call.
[**documentDataCapture**](docs/DocumentCapture.md) | This method is for capture data from provided documents.
[**documentDataSave**](docs/DocumentSave.md) | This method is for save captured document into database.


## Documentation for Method

 - [createUser](docs/CreateUser.md)
 - [documentDataCapture](docs/DocumentCapture.md)
 - [documentDataSave](docs/DocumentSave.md)

# Data-Fornix-Web API : documentDataCapture

This method is responsiable for capture data from provided document object.

## Use

Use DataFornix API SDK instance for call method

```js
// DataFornix API instance
const dataFornixAPIInstance = new DataFornixApi(
    apiToken,
    function (response) {
        console.log('api sdk ready to use', response);
    }
);
```

Call `documentDataCapture` method

```js
// dummy document object
const capturedDocument = {
    'asset_type': 'SELECTED ASSET TYPE' ,
    'front_image': 'FRONT IMAGE Form Data Object',
    'back_image': 'BACK IMAGE Form Data Object'
};

const capturedDocumentRes = dataFornixAPIInstance.documentDataCapture(capturedDocument);
// Return promise object
capturedDocumentRes.then(function (documentData) {
    console.log(documentData)
}, function (error) {
    console.log(error);
});
```

### **Request Parameters**

Files detail object
```
const capturedDocument = {
    'asset_type': 'SELECTED DOCUMENT TYPE',
    'front_image': 'FRONT IMAGE OBJECT',
    'back_image': 'BACK IMAGE OBJECT'
};
```
Name | Type | Description
------------ | ------------- | -------------
**asset_type** | **String** | Selected document type. Document types: **Driving Licence**, **Identity Card**, **Passport**, **Is Right To Work** 
**front_image** | **Form Data Object** | First file form data object 
**back_image** | **Form Data Object** | Second file form data object. Send this image object only if asset type is **Driving Licence** else send `null`

### **Return Response**

`dataFornixAPIInstance.documentDataCapture` will return a javascript promise object.
You can received captured document data object in success callback.

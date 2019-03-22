# Data-Fornix-Web API : documentDataSave

This method is responsiable for save captured document data with document into database.

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

Call `documentDataSave` method

```js
// dummy document object
const capturedDocumentData = CAPTURED_DOCUMENT_DATA;

const documentDataSaveRes = dataFornixAPIInstance.documentDataSave(capturedDocumentData);
// Return promise object
documentDataSaveRes.then(function (response) {
    console.log('success response', response)
}, function (error) {
    console.log(error);
});
```

### **Request Parameters**

**For Driver License**

```js
const capturedDocumentData = {
    asset_type: "Driving Licence",
    first_name: "First Name",
    last_name: "Last Name",
    address: "User Valid, Address, 4040",
    birth_date: "DOB",
    expiry_date: "Expiry Date",
    issue_date: "Issue Date",
    nationality: "User Nationality",
    licence_number: "License number"
};
```
**For Passport**

```js
const capturedDocumentData = {
    asset_type: "Passport"
    first_name: "First Name"
    last_name: "Last Name"
    birth_date: "DOB"
    expiry_date: "Expiry Date"
    gender: "Male"
    nationality: "User Nationality"
    passport_number: "Passport Number"
};
```

### **Return Response**

`dataFornixAPIInstance.documentDataSave` will return a javascript promise object.
You can take different actions for success and failure response.

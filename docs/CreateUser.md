# Data-Fornix-Web API : createUser

This method is responsiable for validate and get user details from DataFornix database. 

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

Call `createUser` method

```js
// dummy user object
const userData = {
    "email":"VALID_USER",
    "name":"USER_NAME",
    "phone_number":"USER_PHONE",
    "country_code":"USER_COUNTRY_CODE"
}

const createUserRes = dataFornixAPIInstance.createUser(userData);
// Return promise object
createUserRes.then(function (success) {
    console.log('User created successfully => ', success)
}, function (error) {
    console.log('Error in create use => ', error);
});
```

### **Request Parameters**

- **User data object**: Object that have following user information

```js
const userData = {
    "email":"VALID USER EMAIL",
    "name":"USER NAME",
    "phone_number":"USER PHONE",
    "country_code":"USER COUNTRY_CODE"
}
```
Name | Type | Description
------------ | ------------- | -------------
**email** | **String** | User email address 
**name** | **String** | User name 
**phone_number** | **String** | User phone number 
**country_code** | **String** | User country code. example: +44

### **Return Response**

`dataFornixAPIInstance.createUser` will return a javascript promise object.
You can take different actions for success and failure response.

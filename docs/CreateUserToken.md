# Data-Fornix-Web API : createUserToken

This method is responsiable generate unique token for user and return generated data in response.

**Note** : This method is alternate of [createUser](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/CreateUser.md) method. Use this if you don't have user detail on the time of api sdk initialization.

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

Call `createUserToken` method

```js
// dummy user object
const request = {
    "token": '<Unique Token Here>'
}

const createUserTokenRes = dataFornixAPIInstance.createUserToken(request);
// Return promise object
createUserTokenRes.then(function (response) {
    console.log('User token created successfully => ', response)
}, function (error) {
    console.log('Error in api => ', error);
});
```

### **Request Parameters**

```js
const request = {
    "token":"<Unique Token>",
}
```
Name | Type | Description
------------ | ------------- | -------------
**token** | **String** | Unique Token

### **Return Response**

`dataFornixAPIInstance.createUserToken` will return following response in javascript promise.

```js
{
    _id: "<user id>",
    token: "<provided token>"
}
```

# Data-Fornix-Web API : checkVideo

This method is responsiable for store and verify user video in Datafornix databse and send verification mail to user

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

Call `checkVideo` method

```js
const videoLivelinessApiRes = dataFornixAPIInstance.checkVideo({
    profile_video: <Form Data of Video here>
});
// Return promise object
videoLivelinessApiRes.then(function (success) {
    console.log(success)
}, function (error) {
    console.log(error);
});
```

### **Request Parameters**

```js
{
    profile_video: <Form Data of Video here>
}
```
Name | Type | Description
------------ | ------------- | -------------
**profile_video** | **File Object** | Video file object

### **Return Response**

`dataFornixAPIInstance.checkVideo` will return a javascript promise object.
You can take different actions for success and failure response.

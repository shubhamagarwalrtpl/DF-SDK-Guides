# Data-Fornix-Web API : getSelfieResult

This method is responsiable for get selfie match status with other asset. It will match user selfie with other uploaded asset and send result.

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

Call `getSelfieResult` method

```js
const userSharedAssets = dataFornixAPIInstance.getSelfieResult();
// Return Object Array with keys  asset_type and is_user_pic_matched
userSharedAssets.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.getSelfieResult` will return following object array.

```
[
    {asset_type: "Driving Licence", is_user_pic_matched: "False"},
    {asset_type: "Passport", is_user_pic_matched: "False"}
    ...
]
```

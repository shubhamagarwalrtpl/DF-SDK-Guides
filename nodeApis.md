DataFornix: Node API's
==================================

## API's

### 1. Create User Token

**Note**: You must call create user token api first before any other api. It will return you token in **auth_token** key. That key will pass in other api call as **auth_token** header

This api is responsiable for create user.

##### 1.1 **API URL**  
`http://api.datafornix.com:8081/api/create-user-token`

##### 1.2 **Method Type**
`POST`

##### 1.3 **Require Parameters**

##### Request ( ** application/json**  )

````js
{
    "user_token": "a4dvvd23", // Required: user unique token here
    "reference_number": "reference number here", // Required
    "channel": "web", // optional
    "type_of_request": "request type here" // optional
}
````

##### Headers

````js
{
    "api_token": "< add valid api_token here >"
}
````

##### 1.4 **Return Response**

It will return following object array.

```
{
    "auth_token": "5cdec08fa920c440dd56af2a",
    "name": "test",
    "channel": "web",
    "reference_number": "1234",
    "type_of_request": ""
}
```

### 2. Update User

This api is responsiable for update user.

##### 2.1 **API URL**  
`http://api.datafornix.com:8081/api/update-user-token`

##### 2.2 **Method Type**
`POST`

##### 2.3 **Require Parameters**

##### Request ( ** application/json**  )

````js
{
    "user_new_token": "12345abcdef", // Required: user unique token here
    "reference_number": "reference number here", // Required
    "channel": "web", // optional
    "type_of_request": "request type here" // optional
}
````

##### Headers

````js
{
    "auth_token": "5cdec08fa920c440dd56af2a", // token that you will receive in create-user => auth_token key response
    "api_token": "< add valid api_token here >"
}
````

##### 2.4 **Return Response**

It will return following object array.

```
{
    "data": {
        "auth_token": "5d1c8560a920c49d8ecb5dfe",
        "name": "guest_12345abcdef",
        "token": "12345abcdef",
        "reference_number": "test",
        "channel": "",
        "type_of_request": ""
    }
}
```

### 3. Document Capture

This api is responsiable for get OCR data of provided documents. 

##### 3.1 **API URL**  
`http://api.datafornix.com:8081/api/document-capture`

##### 3.2 **Method Type**
`POST`

##### 3.3 **Require Parameters**

##### Request ( ** application/json **  )
````js
{
    "document_type": 'Identity Card' // Required: or 'Driving Licence', 'Passport'
    "reference_number": "reference number here", // Required
    "images": [{
        "image_string": "image base64 string here",
        "authority": "authority string herer"
    }, {
        ...
    }], // Required
    "channel": "web", // optional
    "type_of_request": "request type here" // optional
}
````

##### Headers

````js
{
    "auth_token": "5cdec08fa920c440dd56af2a", // token that you will receive in create-user => auth_token key response
    "api_token": "< add valid api_token here >"
}
````


### 4. Document Save

This api is responsiable for save captured document result into database.

##### 4.1 **API URL**  
`http://api.datafornix.com:8081/api/document-save`

##### 4.2 **Method Type**
`POST`

##### 4.3 **Require Parameters**

##### Request ( ** application/json **  )

**For Driver License**

```js
{
    "asset_type": "Driving Licence",
    "first_name": "First Name",
    "last_name": "Last Name",
    "address": "User Valid, Address, 4040",
    "birth_date": "1964-12-02",
    "expiry_date": "1964-12-02",
    "issue_date": "1964-12-02",
    "nationality": "User Nationality",
    "licence_number": "License number"
    "reference_number": "",
    "channel": "web", //optional
    "type_of_request": "" //optional
};
```
**For Passport**

```js
{
    "asset_type": "Passport",
    "first_name": "First Name",
    "last_name": "Last Name",
    "birth_date": "1964-12-02",
    "expiry_date": "1964-12-02",
    "gender": "Male",
    "nationality": "User Nationality",
    "passport_number": "Passport Number",
    "reference_number": "",
    "channel": "web", //optional
    "type_of_request": "" //optional
};
```

**For Identity Card**

```js
{
    "document_type": "Identity Card",
    "first_name": "First Name",
	"last_name": "Last Name",
	"gender": "Male",
	"identity_number": "Identity number",
	"birth_date": "1964-12-02",
	"expiry_date": "1964-12-02",
	"nationality": "User Nationality"
    "reference_number": "Valid reference number",
    "channel": "web", //optional
    "type_of_request": "" //optional
};
```

##### Headers

````js
{
    "auth_token": "5cdec08fa920c440dd56af2a", // token that you will receive in create-user => auth_token key response
    "api_token": "< add valid api_token here >"
}
````

##### 4.4 **Return Response**

It will return following object array.

```
{
    "reference_number": "Provided reference numer here",
    "message": "Identity Card added successfully",
    "channel": "web",
    "type_of_request": "asyc"
}
```


### 5. Selfie Check

This api is responsiable for get selfie image and verify it with user other documents images.

##### 5.1 **API URL**  
`http://api.datafornix.com:8081/api/selfie-check`

##### 5.2 **Method Type**
`POST`

##### 5.3 **Require Parameters**

##### Request ( ** application/json **  )

````js
{
    "selfie_image" : "<image base64 data here...>", // Required
    "reference_number": "", // Required
    "channel": "web", //optional
    "type_of_request": "" //optional
}
````

##### Headers

````js
{
    "auth_token": "5cdec08fa920c440dd56af2a", // token that you will receive in create-user => auth_token key response
    "api_token": "< add valid api_token here >"
}
````

##### 5.4 **Return Response**

It will return following object array.

```
{
    "overall_result": false,
    "comparison_result": [
        {
            "asset_type": "Driving Licence",
            "user_pic": "http://userDocument_url",
            "selfie_pic": "http://userSelfie_url",
            "is_matched": true
        },
        {
            "asset_type": "Passport",
            "user_pic": "http://userDocument_url",
            "selfie_pic": "http://userSelfie_url",
            "is_matched": true
        },
        {
            "asset_type": "Identity Card",
            "user_pic": "http://userDocument_url",
            "selfie_pic": "http://userSelfie_url",
            "is_matched": false
        }
    ]
}
```

### 6. Image Compare

This api is responsiable for compare two image url's.

##### 6.1 **API URL**  
`http://api.datafornix.com:8081/api/compare-image`

##### 6.2 **Method Type**
`POST`

##### 6.3 **Require Parameters**

##### Request ( ** application/json **  )

````js
{
	"first_image_url": "https://qat.datafornix.com/mashreq/get-image/?file=5d1c858ba920c49d8ecb5e01", // Required
	"second_image_url": "https://qat.datafornix.com/mashreq/get-image/?file=5d1c858ba920c49d8ecb5e01", // Required
	"reference_number": "1234", // Required
    "channel": "web", //optional
    "type_of_request": "" //optional
}
````

##### Headers

````js
{
    "auth_token": "5cdec08fa920c440dd56af2a", // token that you will receive in create-user => auth_token key response
    "api_token": "< add valid api_token here >"
}
````

##### 6.4 **Return Response**

It will return following object array.

```js
{
    "first_image_url": "https://qat.datafornix.com/mashreq/get-image/?file=5d1c858ba920c49d8ecb5e01",
    "second_image_url": "https://qat.datafornix.com/mashreq/get-image/?file=5d1c858ba920c49d8ecb5e01",
    "is_matched": true / false,
    "reference_number": "1234",
    "channel": "",
    "type_of_request": ""
}
```

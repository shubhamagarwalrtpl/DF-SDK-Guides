DataFornix: Python API's
==================================

## API's

### 1. Create User Token

**Note**: You must call create user token api first before any other api. It will return you token in **auth_token** key. That key will pass in other api call as **auth_token** header

This api is responsiable for create user.

##### 1.1 **API URL**  
`https://qat.datafornix.com/mashreq/api/v1/create-user-token/`

##### 1.2 **Method Type**
`POST`

##### 1.3 **Require Parameters**

##### Request ( ** application/json**  )

````js
{
    "token":"anupam123", // Required: user unique token here
    "reference_number": "reference number here", // optional
    "channel": "web", // optional
    "type_of_request": "request type here" // optional
}
````

##### Headers

````js
{
    "Token": "Token vB2lWt8gicVs34yXoxH62VsjeLPWCxrH"
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
    "reference_number": "reference number here", // optional
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
`https://qat.datafornix.com/mashreq/api/v1/asset/get-ocr-results/`

##### 3.2 **Method Type**
`POST`

##### 3.3 **Require Parameters**

##### Request ( ** application/json **  )
````js
{
    "document_type": 'Identity Card' // Required: or 'Driving Licence', 'Passport', 'Vehicle Registration'
    "reference_number": "reference number here",
    "images": [{
        "image_string": "image base64 string here",
        "authority": "authority string herer",
        "description":"Front" // Use "Back" for back image
    }, {
        ...
    }], // Required
    "channel": "web", // optional
}
````

##### Headers

````js
{
    "Authorization": "bearer W83CdPEc5wf25aFKBM8zvIdBXZ4nbx0X", // token that you will receive in create-user => auth_token key response
    "Token": "Token vB2lWt8gicVs34yXoxH62VsjeLPWCxrH" // Add a valid api_token
}
````
##### 3.4  Response ( ** application/json **  )
````js
{
    "application_error_list": [     
        {
            "error_code": "",
            "error_message": ""
        },
        {
            "error_code": "",
            "error_message": ""
        }
    ],
    "data": {
        "asset_type": "",
        "channel": "web",
        "reference_number": "",
        "type_of_request": "get OCR",
        "properties": {}      // All extracted fields with values come here
    },
    "image_feedback": {
        "back_image_resolution": "",
        "is_front_exif_data": "",
        "front_image_orientation": "",
        "front_image_resolution": "",
        "is_back_exif_data": "",
        "back_image_orientation": ""
    },
    "image_quality_feedback": ""
}
````
### 4. Get Pdf Ocr

This api is responsiable for get OCR data of provided documents. 

##### 4.1 **API URL**  
`https://qat.datafornix.com/mashreq/api/v1/asset/get-pdf-ocr/`

##### 4.2 **Method Type**
`POST`

##### 4.3 **Require Parameters**

##### Request ( ** application/x-www-form-urlencoded **  )
````js

    "extraction_mode": 'realtime' 
    "document_type": "Trade Licence",
    "pdf": "Upload a pdf file here" // Required
    "reference_number":123, // optional
    "channel":web

````

##### Headers

````js
{
    "Authorization": "bearer W83CdPEc5wf25aFKBM8zvIdBXZ4nbx0X", // token that you will receive in create-user => auth_token key response
    "Token": "Token vB2lWt8gicVs34yXoxH62VsjeLPWCxrH" // Add a valid api_token
}
````
##### 4.5  Response ( ** application/json **  )
````js
{
    "data": {
        "channel": "web",
        "reference_number": "123",
        "properties": {}                  // All extracted fields with values come here
    },
    "application_error_list": []
}
````


### 5. Document Save

This api is responsiable for save captured document result into database.

##### 5.1 **API URL**  
`http://api.datafornix.com:8081/api/document-save`

##### 5.2 **Method Type**
`POST`

##### 5.3 **Require Parameters**

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
    "reference_number": "", //optional
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
    "reference_number": "", //optional
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
    "reference_number": "Valid reference number", //optional
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

##### 5.4 **Return Response**

It will return following object array.

```
{
    "reference_number": "Provided reference numer here",
    "message": "Identity Card added successfully",
    "channel": "web",
    "type_of_request": "asyc"
}
```


### 6. Selfie Check

This api is responsiable for get selfie image and verify it with user other documents images.

##### 6.1 **API URL**  
`http://api.datafornix.com:8081/api/selfie-check`

##### 6.2 **Method Type**
`POST`

##### 6.3 **Require Parameters**

##### Request ( ** application/json **  )

````js
{
    "selfie_image" : "<image base64 data here...>", // Required
    "reference_number": "", // optional
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

### 7. Image Compare

This api is responsiable for compare two image url's.

##### 7.1 **API URL**  
`https://qat.datafornix.com/mashreq/api/v1/compare-image/`

##### 7.2 **Method Type**
`POST`

##### 7.3 **Require Parameters**

##### Request ( ** application/json **  )

````js
{
    "first_image": {
        "image": "https://test/test.png", // or you can send base64 string
        "type": "url" // or you can send base64
    } // Required
    "second_image": {
        "image": "data:image/jpeg;base64,JRgABAQAAAQABAA..==", // or you can send url string
        "type": "base64" // or you can send url
    }, // Required
    "reference_number": "1234", // optional
    "channel": "web", //optional
    "type_of_request": "" //optional
}
````

##### Headers

````js
{
    "Authorization": "bearer W83CdPEc5wf25aFKBM8zvIdBXZ4nbx0X", // token that you will receive in create-user => auth_token key response
    "Token": "Token vB2lWt8gicVs34yXoxH62VsjeLPWCxrH" // Add a valid api_token
}
````

##### 7.4 **Return Response**

It will return following object array.

```js
{
    "is_matched": true / false,
    "reference_number": "1234",
    "channel": "",
    "type_of_request": ""
}
```

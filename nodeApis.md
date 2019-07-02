DataFornix: Node API's
==================================

## API's

### 1. Create User

**Note**: You must call create user api first before any other api. It will return you token in **_id** key. That key will pass in other api call as **auth_token** header

This api is responsiable for create user.

##### 1.1 **API URL**  
`http://api.datafornix.com:8081/api/create-user-token`

##### 1.2 **Method Type**
`POST`

##### 1.3 **Require Parameters**

##### Request ( ** application/json**  )

````js
{
	"user_token": "a4dvvd23", // user unique token here
    "channel": "web", // optional
    "reference_number": "reference number here", // optional
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
    "_id": "5cdec08fa920c440dd56af2a",
    "name": "test",
    "channel": "web",
    "reference_number": "1234",
    "type_of_request": ""
}
```

### 2. Document Capture

This api is responsiable for get OCR data of provided documents. 

##### 2.1 **API URL**  
`http://api.datafornix.com:8081/api/document-capture`

##### 2.2 **Method Type**
`POST`

##### 2.3 **Require Parameters**

##### Request ( ** application/json**  )
````js
{
    "document_type": 'Identity Card' // or 'Driving Licence', 'Passport'
    "channel": "web", // optional
    "reference_number": "reference number here", // optional
    "type_of_request": "request type here" // optional
    "images": [{
        "image_string": "image base64 string here",
        "authority": "authority string herer"
    }, {
        ...
    }]
}
````

##### Headers

````js
{
    "auth_token": "5cdec08fa920c440dd56af2a", // token that you will receive in create-user => _id key response
    "api_token": "< add valid api_token here >"
}
````

### 3. Selfie Check

This api is responsiable for get selfie image and verify it with user other documents images.

##### 3.1 **API URL**  
`http://api.datafornix.com:8081/api/selfie-check`

##### 3.2 **Method Type**
`POST`

##### 3.3 **Require Parameters**

##### Request ( ** form-data **  )

````js
"selfie_image" : "<image form data here...>"
````

##### Headers

````js
{
    "auth_token": "5cdec08fa920c440dd56af2a", // token that you will receive in create-user => _id key response
    "api_token": "< add valid api_token here >"
}
````

##### 3.4 **Return Response**

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

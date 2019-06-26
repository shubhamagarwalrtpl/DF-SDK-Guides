DataFornix: Node API's
==================================

For local setup, run following commands

##### Install dependencies
`
npm installl
`

##### Run app
`
npm start
`

It will run on following url
`
http://localhost:8080
`


## API's

### 1. Create User

**Note**: You must call create user api first before any other api. It will return you token in **_id** key. That key will pass in other api call as **auth_token**

This api is responsiable for create user.

##### 1.1 **API URL**  
`https://df-node-api.herokuapp.com/api/create-user`

##### 1.2 **Method Type**
`POST`

##### 1.3 **Require Parameters**
````js
{
	"email": "test@gmail.com",
    "name": "test",
    "phone_number": "9874563211",
    "country_code": "91"
    "token": "datafornix:234234"
}
````

##### 1.4 **Return Response**

It will return following object array.

```
{
    "_id": "5cdec08fa920c440dd56af2a",
    "email": "test@gmail.com",
    "name": "test",
    "phone_number": "9874563211",
    "country_code": "91"
}
```

### 2. Document Capture

This api is responsiable for get OCR data of provided documents. 

##### 2.1 **API URL**  
`https://df-node-api.herokuapp.com/api/document-capture`

##### 2.2 **Method Type**
`POST`
**Note**: You need to send request data in Form Data Object.

##### 2.3 **Require Parameters**
````js
asset_type: 'Identity Card' // or 'Driving Licence', 'Passport'
front_image: Front_Image Form Data
back_image: Back_Image Form Data
auth_token: '5cdec08fa920c440dd56af2a' // Token that you will received from create user api
````


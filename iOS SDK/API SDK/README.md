# DataFornix Mobile API SDK

This Data-Fornix-Mobile API SDK provides a set of methods for iOS applications to authenticate user, capture, save and retrieve data.

## Getting Started

### Installation
<b>You can achieve the functionality with easy integration of following steps:</b>

- In a new terminal window, run `pod install --repo-update` to install and update. Get [Cocoapods](https://cocoapods.org/)
*you can skip this case if you have updated pod in you mac.*

- Create the podfile in your project.
```
pod init
```

- Open the pod file from directory and add pods in podfile.
```
pod 'DFAPIFramework'
```

- Run command to install
```
pod install
```
<i> If any error occure in the process of pod install then try with pod update command. Now close the xcode project and open prj.xcworkspace instead.</i>

### URL Configuration
Add an url of the server to communicate with the framework in your `Info.plist` file.
Example:
```xml
<key>server url</key>
<string>http://abc.com/api/</string>
```

### Authentication
- Add your org's `APIAccessToken` token in your `Info.plist` file.
Format: 
key => "APIAccessToken" 
value => "<Tenant/Organization Name>:<API Access Token>"
e.g: "abc:token"

### Intialization and Accessing Methods
- `import DFAPIFramework` in your class or file to use the framework.
- Now access all of its methods using `ConnectionManager.instance`

Example:

```swift
// call register user method
ConnectionManager.instance.registerUser(name: <USER_NAME>, email: <VALID_USER>, countryCode: <USER_COUNTRY_CODE>, phoneNumber: <USER_PHONE>, success: { response in
// user created successfully
}, failure: { error in
// error while create user
})
```

## Documentation for API Methods

|Method Name                               |Description                                                                                   |Parameters                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|------------------------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|registerUser                              |This method is used to authenticate the user from server.                                     |1. <b>name</b> - name of the user. <br> 2. <b>email</b> - email address of the user. <br> 3. <b>countryCode</b> - country code. <br> 4. <b>phoneNumber</b> - phone number of the user.                                                                                                                                                                                                                                                                                         |
|checkUserSelfie                           |It is used to save the selfie image in database and verify it with other document's user pics.|<b>multipartDataArray</b> - It requires array of 'MultipartDataModal' object.                                                                                                                                                                                                                                                                                                                                                                         |
|getAssetsType                             |This method is used to get asset types from server.                                           |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|addUpdateAssetDetail                      |Add or update asset details except others type assets.                                        |1. <b>assetSubTypeParent</b> - requires parent type like identity or utility etc. <br> 2. <b>assetDetailId</b> - It is optiononel field. When you adding asset details to server it is empty but when updating it has asset document id. <br> 3. <b>parametersDict</b> - In this field, you need to pass the document information with geo_longitude and geo_latitude in a dictiononery.                                                                                 |
|addUpdateAssetDetailForOthers             |Add or update asset details for others type assets.                                           |1. <b>multipartInfoArray</b> - It requires array of 'MultipartDataModal' object. <br> 2. <b>assetSubTypeParent</b> - It requires parent type like identity or utility etc. <br> 3. <b>assetDetailId</b> - It is optiononel field. When you adding asset details to server it is empty but when updating it has asset document id. <br> 4. <b>comment</b> - comment added to asset of other type. <br> 5. <b>parametersDict</b> - It requires dictiononery with geo_longitude and geo_latitude.|
|getDocumentListing                        |get particular document information.                                                          |1. <b>assetSubTypeId</b> - asset document id. <br> 2. <b>assetSubTypeParent</b> - It requires parent type like identity or utility etc.                                                                                                                                                                                                                                                                                                                        |
|getAllSavedAssets                         |get all uploaded assets on server.                                                            |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|deleteDocumentAsset                       |remove saved document asset from database.                                                    |1. <b>assetURL</b> - It requires parent type like identity or utility etc. <br> 2. <b>assetId</b> - asset document id.                                                                                                                                                                                                                                                                                                                                         |
|getAlertType                              |Get alert types (like Daily, Weekly, Monthly) from server.                                    |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|getAlertsForUser                          |get alerts related to asset expiry.                                                           |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|getKeeperInfo                             |get the list of assets which were shared with me.                                             |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|organisationRequestForAsset               |get the list of requests for uploaded asset.                                                  |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|organisationRequestForAllUserAssetsByEmail|get the list of requests for all user assets.                                                 |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|organisationRequestForUploadAsset         |get the list of requests to upload the asset.                                                 |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|uploadAccessOfAssetToOrganisation         |This method is used to grant or deny access to uploaded asset.                                |1. <b>id</b> - id of request. <br> 2. <b>sharedWith</b> - ID of organisation or admin with which asset will be shared. <br> 3. <b>assetId</b> - asset document id. <br> 4. <b>timePeriod</b> - Date upto which asset will be shared. <br> 5. <b>status</b> - value is either REJECTED or GRANTED.                                                                                                                                                                                             |
|revokeAccessOfAssetToOrganisation         |This method is used to revoke access to organisation.                                         |1. <b>assetId</b> - asset document id. <br> 2. <b>sharedWith</b> - ID of organisation or admin with which asset will be shared.                                                                                                                                                                                                                                                                                                                                |
|requestForShareByMeList                   |get the list of assets which were shared by me.                                               |none                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|getOCRResultFromImage                     |to upload captured image to server and get the scanned data.                                  |1. <b>multipartDataArray</b> - It requires array of 'MultipartDataModal' object. <br> 2. <b>assetSubTypeName</b> - asset document name for eg: Passport and Identity card.                                                                                                                                                                                                                                                                                 |

# DataFornix Mobile API SDK's

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
<key>ServerBaseURL</key>
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
// call create User token method
ConnectionManager.instance.createUserToken(CreateTokenRequestModel(token: "<token_key>", channel: "<channel>", referenceNumber: "<reference_number>", typeOfRequest: "<type_of_request>"), success: { [weak self] (response) in
// user token created successfully
//perform Any OCR image data fetching after it
}, failure: { (error) in
// error while creating token
})
```

### Get OCR image data using MSV

### Intialization and Accessing Methods
- `import DFAPIFramework` in your class or file to use the framework.
- Now access all of its methods using `ConnectionManager.instance`

Example:

```swift
ConnectionManager.instance.getOCRResultFromImageMSV(GetOCRRequestModel(documentType: “<document_type>”, channel: “<channel>”, referenceNumber: “<reference_number>”, images: <Array of OCRImageModel(authority: “<authority>”, description: “<description>”, imageString: "data:image/jpg;base64," + base64encodedImageString”)>), success: { (response) in
  //response received successfully
 print("Response Data: \(response)")
}, failure: { (error) in
//error while getting image data
 print("Error occured: \(error?.localizedDescription)")
})
```                                                                                                    |

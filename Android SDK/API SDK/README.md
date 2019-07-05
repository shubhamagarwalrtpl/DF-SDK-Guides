
## DataFornix-API SDK
![Download](https://api.bintray.com/packages/datafornix/dfapimodule/dfapimodule/images/download.svg)

![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)


This Data-Fornix-Mobile API SDK provides a set of methods for iOS applications to authenticate user, capture, save and retrieve data.

#### You can achieve the functionality with easy integration of following steps:
- In your project level `build.gradle` add this dependency:
```sh 
allprojects {
   repositories {
      jcenter()
       maven { url "https://dl.bintray.com/datafornix/dfapimodule" }
    }
 } 
```
- In your app level `build.gradle` add this dependency:
```sh
implementation 'dfapimodule:dfapimodule:1.0.0'
```
- Initialise `DataFornixSdk` object with your `apiToken`
```sh
DataFornixSdk.initializeSdk(YOUR_API_TOKEN)
```
- Call `all_api_calling` function from `DataFornixSdk` as example:
```sh
DataFornixSdk.sendImageForSelfieCheck(this,
            loggedInUserId, imagePath, object : ApiCallback<UploadAssetBasicResponse> {
                override fun onError(message: String) {
                    showMessage(message)
                }

                override fun onException(throwable: Throwable) {
                    showMessage(throwable.localizedMessage)
                }

                override fun onSuccess(result: UploadAssetBasicResponse) {
                    showMessage(result.message)
                }
            })
```

#### By calling different different methods of`DataFornixSdk` class you will be calling all API's of this SDK and can get callbacks of the API response. Find table of all available methods in API SDK of datafornix:

| Method | Description | 
|--|--|
| initializeSdk | initialises the SDK with api token, this should be call at first before using this SDK. |
| createUser | creates a user on the server or login if user is already created on server. |
| getOcrResultForDocument | uploads the document on server and returns the extracted data from the document after OCR. |
| getAssetTypesList | returns a list of supported asset types to collect from the vault SDK. |
| uploadIdentityAsset | upload a specific type of asset on the server. |
| deleteUserIdentityAsset | deletes a specific asset on the request of the user. |
| updateIdentityAsset | update a specific document or asset on the server. |
| getUserAssetsDetailList | returns a list of assets which are updated by a user. |
| sendVideoForLivelinessCheck | uploads a video after the VideoLiveiness verification. |
| sendImageForSelfieCheck | uploads image of user's selfie after the selfie check verification process |
| getSharedAssetsWithUser | returns a list of documents that are shared with a particular user. |
| getSharedByUserAssets | returns a list of documents that are shared by a particular user. |
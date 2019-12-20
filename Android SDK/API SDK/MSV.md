## DataFornix-API SDK

![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)


This Data-Fornix-Mobile API SDK provides a set of methods for Android applications to authenticate user, capture, save and retrieve data.

#### You can achieve the functionality with easy integration of following steps:
- In your project level `build.gradle` add this dependency:
```sh 
allprojects {
   repositories {
      jcenter()
       maven { url "https://mybigdata-df.bintray.com/dfapimodule" }
    }
 } 
```
- In your app level `build.gradle` add this dependency:
```sh
implementation 'dfapimodule:dfapimodule:1.4.0'
```
- Initialise `DataFornixSdk` object with your `apiToken`
```sh
DataFornixSdk.initializeSdk("YOUR_API_TOKEN", "YOUR BASE URL", "YOUR_AUTHENTICATION_TOKEN")
```
- Call `getOcrResultMSV` function from `DataFornixSdk` as example:
```sh
DataFornixSdk.getOcrResultMSV(
            this,
            GetOcrResultModelMsv(
                "your_channel",
                "your_document_type",
                arrayListOf(Image("your_authority", "your_description_Front_or_Back", "data:image/jpg;base64," + "encodedImageString")),
                "your_reference_number"
            ),
            object : ApiCallback<OcrResultdataMsv> {
                override fun onSuccess(result: OcrResultdataMsv) {
                     // Get Ocr Result Here
                    Log.d("Msv Response", result.toString())
                }

                override fun onError(message: String) {
                    Log.d("Msv Response", message)
                }

                override fun onException(throwable: Throwable) {
                    Log.d("Msv Response", throwable.toString())
                }

            })
```

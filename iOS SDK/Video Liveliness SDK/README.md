# df-secure-otp(DFLivelinessAuth SDK)

This SDK is created to capture a short video of user so that it could be sent to Datafornix server to check if the face in the video matches with the user's selfie or photo extracted from identity document.

An OTP of numbers will appear on screen while recording video and user have to speak those words, after recording spoken numbers will be matched via `Speech-to-Text` processing.

<b>You can achieve the functionality with easy integration of following steps:</b>

- Create the podfile in your project.
```
pod init
```

- Open the pod file from directory and add pods in podfile.
```
pod 'DFLivelinessAuth'
```

- Run command to install
```
pod install
```
<i> If any error occure in the process of `pod install` then try with `pod update` command.
<i> Now close the xcode project and open prj.xcworkspace instead. </i>

- Add the following keys in your 
    -  your org's `VLAccessToken`  token in your `Info.plist` file.
        ```
        <key>VLAccessToken</key>
        <string>Enter your org&apos;s token</string>
        ```
    
    - Privacy - Camera Usage Description, Privacy - Microphone Usage Description, Privacy - Speech Recognition Usage Description
        ```
        <key>NSCameraUsageDescription</key>
        <string>We need to access your camera to record your video.</string>
        
        <key>NSMicrophoneUsageDescription</key>
        <string>We need to access your microphone to record your audio.</string>
        
        <key>NSSpeechRecognitionUsageDescription</key>
        <string>We need to access your speech recognizatio.</string>
        ```
    - Add an url of the server to communicate with the framework in your `Info.plist` file. Example:
       ```xml
        <key>server url</key>
        <string>http://abc.com/api/</string>
       ```
    
- `import DFLivelinessAuth` in your `UIViewController` file where you want to use this feature.

- And instantiate the view with following code and this will also return the video data if user spoken correct words.
            
        let DFVLInstance = DFLivelinessAuth.sharedInstance
        
        DFVLInstance.getRecordedVideo(success: { (data, status) in
            if status {
                // When user spoken correct words.
            } else {
                // When user spoken incorrect words.
            }
        }, failure: { (error) in
        // If user is unabel to authenticate or didn't provide API key.
            print(error)
        })

Output would be:
<br>
<p align="left">
<img src="images/DFLiveliness/user_guide.jpg" width="200"/> &nbsp &nbsp 
<img src="images/DFLiveliness/screen_initialize.jpg" width="200"/> &nbsp &nbsp 
<img src="images/DFLiveliness/record_video.jpg" width="200"/> &nbsp &nbsp 

<br>
<br>
<b>You can cutomize the color and theme of the SDK's view according to your projects user-experience.</b> 

<i>Just access the properties mentioned in the SDK. Have a look at the sample below:</i>

        let DFVLInstance = DFLivelinessAuth.sharedInstance

        DFVLInstance.guidanceHeadingText = "Scan the Document."
        DFVLInstance.guidanceHeadingTextColor = #colorLiteral(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
        DFVLInstance.guidanceDescriptionTextColor = #colorLiteral(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)

        DFVLInstance.regularFont = "Marker Felt"
        DFVLInstance.boldFont = "Marker Felt"

        DFVLInstance.guidanceContinueButtonBgColor = #colorLiteral(red: 0.4078431373, green: 0.7058823529, blue: 0.3647058824, alpha: 1)
        DFVLInstance.guidanceCancelButtonTextColor = #colorLiteral(red: 0.4078431373, green: 0.7058823529, blue: 0.3647058824, alpha: 1)

        DFVLInstance.guidanceBgColor =  #colorLiteral(red: 0.9098039216, green: 0.3921568627, blue: 0.3647058824, alpha: 1)
        DFVLInstance.videoVCGradientColor = #colorLiteral(red: 0.9098039216, green: 0.3921568627, blue: 0.3647058824, alpha: 0.581255008)

        DFVLInstance.getRecordedVideo(success: { (data, status) in
            if status {
                // When user spoken correct words.
            } else {
                // When user spoken incorrect words.
            }
        }, failure: { (error) in
        // If user is unabel to authenticate or didn't provide API key.
            print(error)
        })
            

<br>
<br>
<br>
<p align="left">
<img src="images/confi/user_guide.jpg" width="200"/> &nbsp &nbsp 
<img src="images/confi/screen_initialize.jpg" width="200"/> &nbsp &nbsp 
<img src="images/confi/record_video.jpg" width="200"/> &nbsp &nbsp 


<h2>Here are the list of all the configurable properties, you may need:</h2>
        
        // MARK: - Font family
        public var boldFont: String = "System-Bold" 
        public var regularFont: String = "System"
        public var mediumFont: String = "System"
        public var lightFont: String = "System"
        public var italicFont: String = "System-Italic"

        // - Label texts
        /* This property change the text of the labels(heading - bold) */
        public var guidanceHeadingText = "Prove you're a real person"

        /* This property change the text of the description labels(detail) */
        public var guidanceDescriptionText = "Record yourself saying three randomly generated words to prove you're a real person"

        /* This property change the continue button text */
        public var guidanceContinueButtonText = "CONTINUE"

        /* This property change the cancel button text */
        public var guidanceCancelButtonText = "CANCEL"


        // - Colors
        /* This property change the background color of the view */
        public var guidanceBgColor = #colorLiteral(red: 0.9294117647, green: 0.9294117647, blue: 0.9294117647, alpha: 1)

        /* This property change the text color of the headinglabels(heading - bold) */
        public var guidanceHeadingTextColor = #colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)

        /* This property change the text color of the description labels(detail) */
        public var guidanceDescriptionTextColor = #colorLiteral(red: 0, green: 0, blue: 0, alpha: 0.8562700321)

        /* This property change the text color of the continue button */
        public var guidanceContinueButtonTextColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)

        /* This property change the background color of the continue buttons */
        public var guidanceContinueButtonBgColor = #colorLiteral(red: 0.1490196078, green: 0.5294117647, blue: 0.8745098039, alpha: 1)

        /* This property change the text color of the cancel button */
        public var guidanceCancelButtonTextColor = #colorLiteral(red: 0.1490196078, green: 0.5294117647, blue: 0.8745098039, alpha: 1)

        /* This property change the background color of the cancel buttons */
        public var guidanceCancelButtonBgColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)

        // - Images
        /* This property configure the title image of guidance view */
        public var guidanceHeaderImage = "video"

        // - Layers (radius)
        /** This property change the corner radius of the buttons */
        public var buttonsCornerRadius: CGFloat = 20


        // - Label texts
        /* This property change the text of guidance label on viedo liveliness vc */
        public var videoVCTutorialLabelText = "Tap the button and say the words that appears, Keeping your face with in the screen."

        /* This property change the text of overlay guidance label on viedo liveliness vc */
        public var videoVCOverlayGuidanceLbl = "Processsing..."


        // - Colors
        /* This property change the text color of the gradient */
        public var videoVCGradientColor = #colorLiteral(red: 0, green: 0, blue: 0, alpha: 0.7787710337)

        /* This property change the text color of the label on viedo liveliness vc */
        public var videoVCLabelTextColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)

        /* This property change the text color of the label on viedo liveliness vc */
        public var videoVCOTPLabelTextColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)

        /* This property change the background color of the capture buttons */
        public var videoVCCaptureButtonColor = #colorLiteral(red: 0.9411764706, green: 0.3647058824, blue: 0.3333333333, alpha: 1)

        /* This property change the radius color of the capture buttons */
        public var videoVCCaptureButtonRadiusColor = #colorLiteral(red: 0.4901960784, green: 0.1960784314, blue: 0.1725490196, alpha: 1)

        /* This property change the background color of the number label underline.  */
        public var videoVCOverlayLabelLineColor =  #colorLiteral(red: 0.1490196078, green: 0.5294117647, blue: 0.8745098039, alpha: 1)


        // - Images
        /* This property change the back button of view */
        public var videoVCBackImage = "left-arrow"


        // - Layers (radius)
        /** This property change the corner radius of the buttons */
        public var videoVCCaptureButtonRadiusWidth: CGFloat = 3

        /** This property change the corner radius of the overlayLabel */
        public var videoVCOverlayLabelRadius: CGFloat = 5


<b>More Details( Sample Code Repository):</b>

You can also take help from github repository including the working demo of `VideoLivelinessFramework`.

https://github.com/anandramdeo-df/df-secure-otp

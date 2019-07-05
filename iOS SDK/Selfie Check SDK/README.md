# df-selfie-check (DFSelfieAuth SDK)

This SDK is created to automatically capture the user's selfie using the facial expression( `eye-blink` in our case). It will ensure that user have to be physically present while taking the selfie.

<b>You can achieve the functionality with easy integration of following steps:</b>

- In a new terminal window, run `pod install --repo-update` to install and update. Get [Cocoapods](https://cocoapods.org/)
*you can skip this case if you have updated pod in you mac.*

- Create the podfile in your project.
```
pod init
```

- Open the pod file from directory and add pods in podfile.
```
pod 'DFSelfieAuth'
```

- Run command to install
```
pod install
```
<i> If any error occure in the process of `pod install` then try with `pod update` command.
<i> Now close the xcode project and open prj.xcworkspace instead. </i>

### URL Configuration
Add an url of the server to communicate with the framework in your `Info.plist` file.
Example:
```xml
<key>server url</key>
<string>http://abc.com/api/</string>
```
### Token Configuration
- Add your org's `SLAccessToken`  token in your `Info.plist` file.
    ```
    <key>SLAccessToken</key>
    <string>Enter your org&apos;s token</string>
    ```

### How to use
- `import DFSelfieAuth` in your `UIViewController` file where you want to use this feature.

- And instantiate the view with following code.

         // Open view with default configuration
         
        DFSelfieAuth.sharedInstance.getSelfieImage(success: { (image) in
            self.selfieImageView.image = image
        }, failure: { (error) in
            print(error?.userInfo ?? "Your api token is not valid")
        })

Output would be:
<br>
<p align="left">
<img src="images/selfie-check/user_guide.jpg" width="200"/> 
<img src="images/selfie-check/permission.jpg" width="200"/>
<img src="images/selfie-check/take_selfie.jpg" width="200"/>
<img src="images/selfie-check/choose_photo.jpg" width="200"/>
  
<br>
<br>
<b>You can cutomize the color and theme of the SDK's view according to your projects user-experience.</b> 

<i>Just access the properties mentioned in the SDK. Have a look at the sample below:</i>

        let DFSAInstance = DFSelfieAuth.sharedInstance
        DFSAInstance.globalBGColor = #colorLiteral(red: 0.9137254902, green: 0.3921568627, blue: 0.3647058824, alpha: 1)
        DFSAInstance.globalMessagesColor = UIColor.white
        DFSAInstance.globalTitleColor = UIColor.white
        DFSAInstance.globalButtonCornerRadius = 5
        DFSAInstance.globalOptionButtonColor = #colorLiteral(red: 0.9725490196, green: 0.9725490196, blue: 0.9725490196, alpha: 1)
        DFSAInstance.globalTitleOptionButtonColor = #colorLiteral(red: 0.4039215686, green: 0.7098039216, blue: 0.3647058824, alpha: 1)
        DFSAInstance.navigationTitleColor = #colorLiteral(red: 0.4039215686, green: 0.7098039216, blue: 0.3647058824, alpha: 1)
        DFSAInstance.globalActioButtonColor = #colorLiteral(red: 0.4039215686, green: 0.7098039216, blue: 0.3647058824, alpha: 1)
        DFSAInstance.globalTitleActionButtonColor = #colorLiteral(red: 0.9725490196, green: 0.9725490196, blue: 0.9725490196, alpha: 1)

        DFSAInstance.tipGuidanceOne = "Tip : Please look straight and then blink eyes."
        DFSAInstance.titlePermissionVC = "Please Allow camera permission."

        DFSAInstance.getSelfieImage(success: { (image) in
            self.selfieImageView.image = image
        }, failure: { (error) in
            print(error?.userInfo ?? "Your api token is not valid")
        })

Updated UI output would be:
<br>
<p align="left">
<img src="images/config/user_guide.jpg" width="200"/> 
<img src="images/config/permission.jpg" width="200"/>
<img src="images/config/take_selfie.jpg" width="200"/>
<img src="images/config/choose_photo.jpg" width="200"/>
  
<br>
  
<h2>Here are the list of all the configurable properties, you may need:</h2>

    /** This property change the background colour of the guidance screen. */
    public var globalBGColor: UIColor

    /** This property change the colour of the photo guidance button. */
    public var globalActioButtonColor: UIColor

    /** This property change the colour of the title of photo guidance button. */
    public var globalTitleActionButtonColor: UIColor

    /** This property change the corner radius of the photo guidance button. */
    public var globalButtonCornerRadius: CGFloat

    /** This property change the color of the cancle button, default is white */
    public var globalOptionButtonColor: UIColor

    /** This property change the colour of the title of photo guidance button. */
    public var globalTitleOptionButtonColor: UIColor

    /** This property change the color of the title of all the screens. */
    public var globalTitleColor: UIColor

    /** This property change the color of the messages of all the screens. */
    public var globalMessagesColor: UIColor

    /** This property change the color of the navigation bar. */
    public var navigationTitleColor: UIColor

    /** This property change the color of the navigation bar. */
    public var navigationBarColor: UIColor

    /** This property change the color of the border global button. */
    public var globalBorderButtonColor: UIColor

    /** This property change the color of the border global option button. */
    public var globalOptionBorderButtonColor: UIColor

    /** This property change the navigation title for first guidance view controller. */
    public var titleNavGuidanceOne: String?

    /** This property change the title message for first guidance view controller. */
    public var messageGuidanceOne: String?

    /** This property change the tip field on the first guidance view controller. */
    public var tipGuidanceOne: String?

    /** This property change the title of action button for first guidance view controller. */
    public var actionTitleGuidanceOne: String?

    /** This property change the title of cancle button for first guidance view controller. */
    public var cancleTitleGuidanceOne: String?

    /** This property change the navigation title for permission view controller. */
    public var titleNavPermissionVC: String?

    /** This property change the title for permission view controller. */
    public var titlePermissionVC: String?

    /** This property change the message for permission view controller. */
    public var messagePermissionVC: String?

    /** This property change the title of action button for permission view controller.  */
    public var actionTitlePermissionVC: String?

    /** This property change the title of cancle button for permission view controller.  */
    public var cancleTitlePermissionVC: String?

    /** This property change the title of action button for select selfie.  */
    public var actionTitleSelectSelfieVC: String?

    /** This property change the title of cancle button for permission view controller.  */
    public var cancleTitleSelectSelfieVC: String?

    /** This property changes the color for overlay view on capture-selfie screen.*/
    public var overlayColor: UIColor
    
    /** This property return the selfie image of the user. */
    public var returnClosure: ((UIImage?) -> Void)?

<br>
---

<br>
<b>More Details( Sample Code Repository):</b>

You can also take help from github repository including the working demo of `SelfieCheckFramework`.

https://github.com/anandramdeo-df/df-selfie-check

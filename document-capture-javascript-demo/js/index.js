/* var currentTab = 0;
var userData = {};
var selectedDocumentType = '';
var user_id = '';
var apiServer;
var documentCapture;
var capturedDocument = {};
var capturedDocumentRes = {}; */

const options = {
    currentTab: 0,
    userData: {},
    selectedDocumentType: '',
    apiServer: '',
    documentCapture: null,
    capturedDocument: {},
    capturedDocumentRes: {},
    apiToken: 'pruvista:SqxYKsMhCHGCFGTrA1qeElGqd2BFekgr',
    sdkToken: 'pruvista:FLzt5y1HxGkbJkFMUrhrbBbAsepKjDt7',
    labels: {
        'Driving Licence': {
            'firstTitle': 'Front of Licence',
            'firstPlaceholder': 'Drag front of licence..',
            'secondTitle': 'Back of Licence',
            'secondPlaceholder': 'Drag back of licence..'
        },
        'Identity Card': {
            'firstTitle': 'Front of Identity Card',
            'firstPlaceholder': 'Drag front of identity card..',
            'secondTitle': 'Back of Identity Card',
            'secondPlaceholder': 'Drag back of identity card..'
        },
        'Passport': {
            'firstTitle': 'Passport',
            'firstPlaceholder': 'Drag your passport here..',
            'secondTitle': '',
            'secondPlaceholder': ''
        },
        'PAN Card': {
            'firstTitle': 'Front of PAN Card',
            'firstPlaceholder': 'Drag front of pan card..',
            'secondTitle': 'Back of PAN Card',
            'secondPlaceholder': 'Drag back of pan card..'
        }
    }
};

$(function () {
    if ($.cookie("user")) {
        options.userData = JSON.parse($.cookie("user"));
        setUserDetail(options.userData)
        options.currentTab = 1;
    }
    showTab(options.currentTab); // Display the crurrent tab
});

function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    $('.tab').hide();
    $('.tab').eq(n).show();
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        $('#heading').text('Login')
        //document.getElementById("prevBtn").style.display = "none";
    } else if (n == 1) {
        options.capturedDocumentRes = {};
        $('#heading').text('Select Document Type')
    } else if (n == 2) {
        $('#heading').text('Capture document')

        /* API Sdk initialization */
        options.apiServer = new DataFornixApi(options.apiToken, function (res) {
            console.log('api sdk initialization', res);
        });
        const createUserRes = options.apiServer.createUser(options.userData);
        createUserRes.then(function (success) {
            console.log('User created successfully => ', success)
        }, function (error) {
            console.log('Error in create use => ', error);
        });

        /* Document Capture SDK Initialization */
        options.documentCapture = new DataFornixDC({
            containerId: 'documentCapturedDiv',
            token: options.sdkToken,
            documentBackCapture: (options.selectedDocumentType == 'Driving Licence' || options.selectedDocumentType == 'Identity Card' || options.selectedDocumentType == 'PAN Card') ? true : false,
            uiOptions: {
                // drag options
                'isDraggabel': true,
                'dragAreaHight': 125,
                'dragAreaWidth': 180,
                'documentPreview': true,

                //input options
                'firstInputTitle': options.labels[options.selectedDocumentType].firstTitle,
                'firstInputPlaceholder': options.labels[options.selectedDocumentType].firstPlaceholder,
                'secondInputTitle': options.labels[options.selectedDocumentType].secondTitle,
                'secondInputPlaceholder': options.labels[options.selectedDocumentType].secondPlaceholder,

                //UI options
                'borderColor': '#ccc',
                'fontSize': 14,
                'fontFamily': 'Raleway',
                'buttonPrimaryColor': '#4CAF50',
                'fontColor': '#333'
            },
            onComplete: documentCaptureCallback
        });
        $('#nextBtn').attr("disabled", true);
    } else if (n == 3) {
        $('#heading').text('Save document')
    } else {
        // document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {

    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    if (options.currentTab + n == 1) {
        var data = {
            email: $('#username').val(),
            password: $('#password').val()
        };
        $('#loader').show();
        $.ajax({
            url: "http://52.232.30.222:5000/login/",
            method: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            //dataType: "json",
            success: function (res) {
                //set user data
                var user = {};
                user['email'] = res['username'];
                user['name'] = res['name'];
                user['phone_number'] = res['phone_number'];
                user['country_code'] = res['country_code'];

                $.cookie("user", JSON.stringify(user), { expires: 1 });

                options.userData = JSON.parse($.cookie("user"));
                setUserDetail(options.userData);

                // This function will figure out which tab to display
                var x = document.getElementsByClassName("tab");

                // Hide the current tab:
                x[options.currentTab].style.display = "none";

                // Increase or decrease the current tab by 1:
                options.currentTab = options.currentTab + n;

                // Otherwise, display the correct tab:
                $('#loader').hide();
                showTab(options.currentTab);
            },
            error: function (error) {
                $('#loader').hide();
                alert('Invalid credentials');
            }
        })
    } else if (options.currentTab + n == 2) {
        options.selectedDocumentType = $('input[name=document]:checked').val();
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");

        // Hide the current tab:
        x[options.currentTab].style.display = "none";

        // Increase or decrease the current tab by 1:
        options.currentTab = options.currentTab + n;

        // Otherwise, display the correct tab:
        showTab(options.currentTab);
    } else if (options.currentTab + n == 3) {
        if (options.capturedDocument.asset_type
            && options.capturedDocument.front_image
            && options.capturedDocument.back_image !== undefined) {
            $('#loader').show();
            const documentDataCapturePromise = options.apiServer.documentDataCapture(options.capturedDocument);

            documentDataCapturePromise.then(function (res) {
                options.capturedDocumentRes = res['properties'];
                options.capturedDocumentRes['asset_type'] = res['asset_type'];

                console.log('User document captured data => ', options.capturedDocumentRes);

                for (var key in options.capturedDocumentRes) {
                    if ($('#' + key).length) {
                        if ($('.' + key).length && $('.' + key).hasClass('hide')) {
                            $('.' + key).removeClass('hide');
                        }
                        if (key == 'identity_number') {
                            $('#' + key).val(options.capturedDocumentRes[key].split(" ").join("").replace(/^(.{4})(.{4})(.*)$/, "$1 $2 $3"))
                        } else {
                            $('#' + key).val(options.capturedDocumentRes[key]);
                        }
                    }
                }

                // This function will figure out which tab to display
                var x = document.getElementsByClassName("tab");

                // Hide the current tab:
                x[options.currentTab].style.display = "none";

                // Increase or decrease the current tab by 1:
                options.currentTab = options.currentTab + n;

                // Otherwise, display the correct tab:
                $('#loader').hide();
                showTab(options.currentTab);
            }, function (error) {
                console.log('Error in capture data api => ', error);
                var errMessage = error['message'] || error;
                if (typeof error === 'object' && Object.keys(error).length) {
                    Object.keys(error).forEach(function (key) {
                        var value = error[key];
                        errMessage = key + ':' + value;
                    });
                }
                $('#loader').hide();
                alert(errMessage);
                options.currentTab = 1;
                if (options.documentCapture) {
                    options.documentCapture.clearState();
                }
                resetForm();
                showTab(options.currentTab);
            });
        } else {
            $('#loader').hide();
            alert('Invalid data provided');
        }
    } else if (options.currentTab + n == 4) {
        $('#loader').show();
        if (options.capturedDocumentRes && Object.keys(options.capturedDocumentRes).length) {
            $('.submitFormFields').find('p:not(.hide)').each(function () {
                if ($(this).has('input').length) {
                    options.capturedDocumentRes[$(this).find('input').attr('id')] = $(this).find('input').val();
                }
                if ($(this).has('textarea').length) {
                    options.capturedDocumentRes[$(this).find('textarea').attr('id')] = $(this).find('textarea').val();
                }
                if ($(this).has('select').length) {
                    options.capturedDocumentRes[$(this).find('select').attr('id')] = $(this).find('select').val();
                }
            });
            const capturedDocumentSavePromise = options.apiServer.documentDataSave(options.capturedDocumentRes);
            capturedDocumentSavePromise.then(function (res) {
                $('#loader').hide();
                console.log('Captured data saved successfully => ', res)
                alert('Data saved successfully');
                options.currentTab = 1;
                if (options.documentCapture) {
                    options.documentCapture.clearState();
                }
                resetForm();
                showTab(options.currentTab);
            }, function (error) {
                $('#loader').hide();
                console.log('Error in create use => ', error);

                var errMessage2 = error;
                if (typeof error === 'object' && Object.keys(error).length) {
                    Object.keys(error).forEach(function (key) {
                        var value = error[key];
                        errMessage2 = key + ':' + value;
                    });
                }
                alert(errMessage2);
                options.currentTab = 1;
                if (options.documentCapture) {
                    options.documentCapture.clearState();
                }
                resetForm();
                showTab(options.currentTab);
            });
        } else {
            $('#loader').hide();
            alert('Invalid data provided');
        }
    }
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[options.currentTab].getElementsByTagName("input");

    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].hasAttribute('data-required') && y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[options.currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}

function documentCaptureCallback(res) {
    options.capturedDocument = {
        'asset_type': options.selectedDocumentType,
        'front_image': res.frontFile,
        'back_image': res.backFile
    };
    console.log('Droped documents', options.capturedDocument);
    $('#nextBtn').attr("disabled", false);
}

function setUserDetail(data) {
    var html = '';
    if (data && data.name) {
        html = '<div class="welcome">Welcome ' + data.name + '</div><div class="logout"><a hred="javascript:;" onClick="logout()">Logout</a></div>'
        $('#loggedinUserDetail').html(html);
    }
}

function logout() {
    if ($.cookie("user")) {
        $.removeCookie('user');
        $('#loggedinUserDetail').html('');
        options.currentTab = 0
        if (options.documentCapture) {
            options.documentCapture.clearState();
        }
        resetForm();
        showTab(options.currentTab);
    }
}

function resetForm() {
    $('.hide-handler').each(function() {
        if (!$(this).hasClass('hide')) {
            $(this).addClass('hide');
        }
    })
}
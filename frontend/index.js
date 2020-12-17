//---------------------------------- Main Code Area ----------------------------------//
var ButtonClicked = false;

var DEFAULT_TIME_DELAY = 1000;

// Variable for the chatlogs div
var $chatlogs = $('.chatlogs');


var DataFrame = dfjs.DataFrame;

var questions_dict;
var tags;
var english_options;

function myQuestions(df) {
    questions_dict = df.toDict();
	english_options = questions_dict['options']
}

DataFrame.fromCSV('https://www.checkcorona.online/manthan.csv').then(myQuestions);

function myAdvice(df) {
    advice_dict = df.toDict();
}

DataFrame.fromCSV('https://www.checkcorona.online/manthan_advice.csv').then(myAdvice);

	
var dict = {};
var counter = 0;

var userData = {'version':1};

var selectOne;
var firstOption;
var mode;
var get_contact = false;
var send_message = false;

var lang_list = ['English','Hindi','Gujarati','Marathi','Bangla','Telugu','Tamil','Kannada']


var disclaimer = {
	"English":"single<br 1000>This self assessment scan has been made on the basis of WHO and Govt of India guidelines. This interaction should not be taken as expert medical advice.<ar>I understand",
	"हिंदी" : "single<br 1000>यह स्व-मूल्यांकन स्कैन डब्ल्यूएचओ और भारत सरकार के दिशानिर्देशों पर आधारित है। इस बातचीत को विशेषज्ञ चिकित्सा सलाह के रूप में नहीं लिया जाना चाहिए।<ar> मै समझता हुँ", 
	"ગુજરાતી" : "single<br 1000>આ સ્વમૂલ્યાંકન સ્કેન ડબ્લ્યુએચઓ અને ભારત સરકારના માર્ગદર્શિકાના આધારે બનાવવામાં આવ્યું છે. આ વાતચીત નિષ્ણાત તબીબી સલાહ તરીકે લેવી જોઈએ નહીં.<ar>હું સમજુ છુ",
	"मराठी" : "single<br 1000>हे स्व-मूल्यांकन स्कॅन डब्ल्यूएचओ आणि भारत सरकारच्या मार्गदर्शक तत्त्वांच्या आधारे केले गेले आहे. हा संवाद तज्ञ वैद्यकीय सल्ला म्हणून घेऊ नये.<ar>मला समजले",
	"বাংলা" : "single<br 1000>এই স্ব-মূল্যায়ন স্ক্যানটি ডাব্লুএইচও এবং ভারত সরকারের নির্দেশিকা ভিত্তিক এই ইন্টারঅ্যাকশন বিশেষজ্ঞের পরামর্শ হিসাবে গ্রহণ করা উচিত নয়<ar>আমি বুঝেছি<ar>আমি বুঝেছি",
	"తెలుగు" : "single<br 1000>ఈ స్వీయ-అంచనా స్కాన్ WHO మరియు భారత ప్రభుత్వ మార్గదర్శకాలపై ఆధారపడి ఉంటుంది. ఈ పరస్పర చర్యను నిపుణుల వైద్య సలహాగా తీసుకోకూడదు<ar>నాకు అర్థమైనది <ar>నాకు అర్థమైనది",
	"தமிழ்" : "single<br 1000>WHO மற்றும் இந்திய அரசாங்க வழிகாட்டுதலின் அடிப்படையில் இந்த சுய பரிசோதனை செய்யப்பட்டுள்ளது. இதை மருத்துவ நிபுணரின் ஆலோசனையாக எடுத்துக் கொள்ளக்கூடாது.<ar>எனக்கு புரிகிறது<ar>எனக்கு புரிகிறது",
	"ಕನ್ನಡ": "single<br 1000>ಈ ಸ್ವ-ಮೌಲ್ಯಮಾಪನ ಸ್ಕ್ಯಾನ್ WHO ಮತ್ತು ಭಾರತ ಸರ್ಕಾರದ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಆಧರಿಸಿದೆ. ಈ ಸಂವಾದವನ್ನು ತಜ್ಞ ವೈದ್ಯಕೀಯ ಸಲಹೆಯಾಗಿ ತೆಗೆದುಕೊಳ್ಳಬಾರದು.<ar>ನನಗೆ ಅರ್ಥವಾಗಿದೆ"
}

var flowList;
var multiSelect = [];
var multiSelectIndex = [];
var selectMultiple = false;
var options_dict = {
	"English":"option<br 1000> How can I help you? <ar> Corona Risk Scan <ar> Safety Guidelines",
	"हिंदी" : "option<br 1000> मैं आपकी क्या सहायता कर सकती हूं? <ar> कोरोना रिस्क स्कैन <ar> सुरक्षा निर्देश", 
	"ગુજરાતી" : "option<br 1000> હું આપની શું મદદ કરી શકું?<ar> કોરોના રિસ્ક સ્કેન <ar> સુરક્ષા માર્ગદર્શિકા",
	"मराठी" : "option<br 1000> मी तुम्हाला काय मदत करू?<ar> कोरोना रिस्क स्कॅन <ar> सुरक्षितता मार्गदर्शक तत्त्वे",
	"বাংলা" : "option<br 1000> আমি কি আপনাকে সাহায্য করতে পারি? <ar> পুষ্পমুকুট ঝুঁকি স্ক্যান <ar> সতর্কতামূলক নির্দেশনা",
	"తెలుగు" : "option<br 1000> నేను మీకు ఏమి సహాయం చేయగలను <ar> కరోనా రిస్క్ స్కాన్ <ar> భద్రత మార్గదర్శకాలు",
	"தமிழ்" : "option<br 1000> நான் உங்களுக்கு என்ன உதவ முடியும் <ar> கொரோனா இடர் ஸ்கேன் <ar> பாதுகாப்பு வழிகாட்டுதல்கள்",
	"ಕನ್ನಡ": "option<br 1000> ನಾನು ನಿಮಗೆ ಏನು ಸಹಾಯ ಮಾಡಬಹುದು <ar> ಕರೋನಾ ರಿಸ್ಕ್ ಸ್ಕ್ಯಾನ್ <ar> ಸೇಫ್ಟಿ ಮಾರ್ಗಸೂಚಿಗಳು"
}

var status_dict = {
	"English":"<br 500>Analysis going on...",
	"हिंदी" : "<br 500>विश्लेषण चल रहा है...", 
	"ગુજરાતી" : "<br 500>વિશ્લેષણ ચાલુ છે...",
	"मराठी" : "<br 500>विश्लेषण चालू आहे...",
	"বাংলা" : "<br 500>বিশ্লেষণ চলছে..",
	"తెలుగు" : "<br 500>విశ్లేషణ జరుగుతోంది...",
	"தமிழ்" : "<br 500>பகுப்பாய்வு நடக்கிறது",
	"ಕನ್ನಡ": "<br 500>ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ"	
}

var share_dict = {
	"English":"<br 3500>Share this app to help your friends and family",
	"हिंदी" : "<br 3500>अपने दोस्तों और परिवार की सहायता के लिए इस ऐप को शेयर करें", 
	"ગુજરાતી" : "<br 3500>તમારા મિત્રો અને પરિવારને મદદ કરવા માટે આ એપ્લિકેશન શેર કરો",
	"मराठी" : "<br 3500>आपल्या मित्र आणि कुटुंबास मदत करण्यासाठी हा अ‍ॅप सामायिक करा",
	"বাংলা" : "<br 3500>আপনার অ্যাপ্লিকেশন শেয়ার করুন এবং সাহায্য করুন অ্যাপ্লিকেশন শেয়ার করুন",
	"తెలుగు" : "<br 3500>మీ స్నేహితులు మరియు కుటుంబ సబ్యులకు ఈ యాప్ ని షేర్ చేయడం వలన వారికీ ఉపయోగపడగలదు",
	"தமிழ்" : "<br 3500>உங்கள் நண்பர்கள் மற்றும் குடும்பத்தினருக்கு உதவ இந்த பயன்பாட்டைப் பகிரவும்",
	"ಕನ್ನಡ": "<br 3500>ನಿಮ್ಮ ಸ್ನೇಹಿತರು ಮತ್ತು ಕುಟುಂಬಕ್ಕೆ ಸಹಾಯ ಮಾಡಲು ಈ ಅಪ್ಲಿಕೇಶನ್ ಹಂಚಿಕೊಳ್ಳಿ"	
}

var again_dict = {
	"English":"Start again",
	"हिंदी" : "फिर से शुरू करें", 
	"ગુજરાતી" : "ફરીથી શરૂ કરો",
	"मराठी" : "पुन्हा प्रारंभ करा",
	"বাংলা" : "আবার শুরু",
	"తెలుగు" : "పునఃప్రారంభించండి",
	"தமிழ்" : "மீண்டும் தொடங்க",
	"ಕನ್ನಡ": "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ"		
}

var msg_dict = {
	"English":"Send message to developers",
	"हिंदी" : "निर्माता को संदेश भेजें", 
	"ગુજરાતી" : "ઉત્પાદકોને સંદેશ મોકલો",
	"मराठी" : "निर्मात्यास संदेश पाठवा",
	"বাংলা" : "প্রযোজককে বার্তা পাঠান",
	"తెలుగు" : "తయారీదారుకు సందేశం పంపండి",
	"தமிழ்" : "உற்பத்தியாளருக்கு செய்தி அனுப்புங்கள்",
	"ಕನ್ನಡ": "ತಯಾರಕರಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ"		
}

var input_name;
var input_number;
var none_selected = false;
var acc_loc = false;

const ask_opt = [1,2,3,4,5,6];
const ask_at = ask_opt[Math.floor(Math.random() * ask_opt.length)];


var gaugeOptions = {
    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};



function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


$('document').ready(function(){

	// Hide the switch input type button initially
	// $("#switchInputType").toggle();


	if (document.cookie.split(';').some(function(item) {
	    return item.trim().indexOf('ID=') == 0
	})) {
		console.log('found cookie')
		userData['ID'] = document.cookie.replace(/(?:(?:^|.*;\s*)ID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	} else {
		console.log('new cookie')
		userData['ID'] = uuidv4()
		document.cookie = "ID="+userData['ID'];
	}
	userData['visit_time'] = +new Date;
	userData['location_asked_at'] = ask_at;
	// If the switch input type button is pressed

	$("#switchInputType").click(function(event) {

		// Toggle which input type is shown
		if($('.buttonResponse').is(":visible")) {
			$("#switchInputType").attr("src", "Images/multipleChoice.png");
		}

		else {
			$("#switchInputType").attr("src", "Images/keyboard.png");
		}
		$('input').toggle();
		$('.buttonResponse').toggle();

	});

	showPosition = function (position) {
		console.log("Latitude: " + position.coords.latitude +"<br>Longitude: " + position.coords.longitude);
	}

	if(ask_at == 1){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		}
	}

	//----------------------User Sends Message Methods--------------------------------//
	// Method which executes once the enter key on the keyboard is pressed
	// Primary function sends the text which the user typed
	$("input").keypress(function(event) {
		
		// If the enter key is pressed
		if(event.which === 13) {

			// Ignore the default function of the enter key(Dont go to a new line)
			event.preventDefault();

			ButtonClicked = false;
			$('input').hide();

			// Call the method for sending a message, pass in the text from the user
			send(this.value);
			
			// reset the size of the text area
			$(".input").attr("rows", "1");

			// Clear the text area
			this.value = "";

			// if($("#switchInputType").is(":visible")) {
			// 	$("#switchInputType").toggle();
			// 	$('.buttonResponse').remove();
			// }

		}
	});


	// If the user presses the submit button
	$("#submit").click(function(event) {
		$('.buttonResponse').remove();
		$('#submit').hide();	
		$('.msg').hide();
		console.log('button status '.concat(ButtonClicked))
		if (get_contact) {
			input_number = document.getElementById("mobile_number").value
			input_name = document.getElementById("mobile_name").value
			$('input').hide();
			send(input_name+" - "+input_number);
		} else if (send_message){
			name = document.getElementById("name").value
			contact = document.getElementById("contact").value
			message = document.getElementById("message").value
			$.ajax({
				type: "POST",
				// Change your API url here 
				// url: "https://gem.eastus2.cloudapp.azure.com/predict",
				url: "https://coronacheck.azurewebsites.net/message",
			    dataType: 'json',
 			    contentType: 'application/json; charset=utf-8',
				crossDomain: true,
				// No authorization header required - hence removed
				// headers: {
				// 	"Authorization": "Bearer " + accessToken
				// },
				data: JSON.stringify({'name':name, 'contact':contact, 'message':message, 'referrer':document.referrer}),
				success: function(responseData) {
		            // console.log(responseData);
				
				// Pass the response into the method 
				newRecievedMessage("You message has been sent. Thank You");
				$('.msg').hide();
				},
				error: function() {
					// newRecievedMessage("Processing your request...")
					newRecievedMessage("Sorry, the system is facing unexpectedly high number of requests. Please try again later.");
				}
			});
			// $('input').hide();
			$('.restart').show();
			$('#message').hide();	
			// send(name.concat());
		} else {
			ButtonClicked = false;
			console.log(multiSelect)
			var selected_options = [];
			console.log('getting inside loop'.concat(multiSelectIndex));
			for(i=0;i<multiSelectIndex.length;i++){
				console.log(i);
				console.log('eval '.concat(eval(english_options[counter])));
				selected_options.push(eval(english_options[counter])[multiSelectIndex[i]]);
				console.log('selected '.concat(selected_options));
			}
			send(multiSelect,multiSelectIndex,selected_options);
			

			multiSelect = [];
			multiSelectIndex = [];
			// $('#switchInputType').hide();
		}
		none_selected=false;
		// console.log(document.getElementById("input").value);
		// Call the method to switch recognition to voice input
		// switchRecognition();
	});




	newRecievedMessage("lang<br 1000>Hi, I am Ana. Please select your language<ar>English<ar>हिंदी<ar>ગુજરાતી<ar>मराठी<ar>বাংলা<ar>తెలుగు<ar>தமிழ்<ar>ಕನ್ನಡ");
	$('input').hide();
	$('#submit').hide();


	// If the user selects one of the dynamic button responses
	$('.chat-form').on("click", '.buttonResponse', function() {
		selected_id = event.target.id;
		console.log("select id ".concat(selected_id))
		if(eval(english_options[counter])[selected_id] == "None of these"){
			console.log("NONE OF THESE")
			$(".buttonResponse").css("background-color", "rgb(0,108,181)");
			this.style.backgroundColor = "rgb(244,113,33)";
	        multiSelect = [this.innerText];
			multiSelectIndex = [selected_id];
			console.log(multiSelect);
			ButtonClicked=true
			none_selected=true
		} else if (none_selected){
			$(".buttonResponse").css("background-color", "rgb(0,108,181)");
	        this.style.backgroundColor = "rgb(244,113,33)";
	        multiSelect = [this.innerText];
			multiSelectIndex = [selected_id];
			console.log(multiSelect);
			none_selected=false;
		} else if (selectLang || selectOption || selectOne) {
	 		console.log('top');
	 		send(this.innerText, selected_id);
			$('.buttonResponse').remove();
			// console.log("english_options".concat(eval(english_options[counter])))
	 	} else if (multiSelect.includes(this.innerText)) {
	   		const index = multiSelect.indexOf(this.innerText);
	   		multiSelect.splice(index, 1);
	   		const index_id = multiSelect.indexOf(selected_id);
	   		multiSelectIndex.splice(index_id,1);
 			console.log(multiSelect);
	        this.style.backgroundColor="rgb(0,108,181)";
			if(multiSelect.length >0){
				ButtonClicked = true
			} else {
				ButtonClicked = false
			}	     
	    } else {
	        this.style.backgroundColor = "rgb(244,113,33)";
	        multiSelect.push(this.innerText);
			multiSelectIndex.push(selected_id);
			console.log(multiSelect);
			ButtonClicked=true
		}



		// Send the text on the button as a user message
		// send(this.innerText);
		
		// // Show the record button and text input area
		// $('#submit').toggle();
		// $('input').toggle();

		// // Hide the button responses and the switch input button
		// $('.buttonResponse').toggle();
		// $('#switchInputType').hide();

		// // Remove the button responses from the div
		
	});




	console.log(userData);



})


// Method which takes the users text and sends an AJAX post request to API.AI
// Creates a new Div with the users text, and recieves a response message from API.AI 
function send(text, selected_id, selected_options) {
	console.log("send for ".concat(text))
	console.log("counter ".concat(counter))
	// Create a div with the text that the user typed in
	$chatlogs.append(
        $('<div/>', {'class': 'chat self'}).append(
            $('<p/>', {'class': 'chat-message', 'text': text})));
 	$chatlogs.css("margin-right", "auto");

	// Find the last message in the chatlogs
	var $sentMessage = $(".chatlogs .chat").last();
	
	// Check to see if that message is visible
	checkVisibility($sentMessage);

	// update the last message sent variable to be stored in the database and store in database
	// lastSentMessage = text;
	
	if (selectLang) {
 		selectLang = false;
 		languagePrefrence = text.trim();
 		userData['lang'] = lang_list[selected_id];
 		userData['answers'] = {};
 		userData['selections'] = {};
 		userData['action_time'] = {};
 		if(ask_at == 2){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			}
		}
 		newRecievedMessage(options_dict[languagePrefrence]);
 		$('#again_call').text(again_dict[languagePrefrence]);
 		$('#msg_call').text(msg_dict[languagePrefrence]);
	} else if (selectOption) {
		if(ask_at == 3){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			}
		}
 		selectOption = false;
 		if (selected_id=='0'){
			flowList = questions_dict[languagePrefrence];
			tags = questions_dict['tag'];
			newRecievedMessage(flowList[counter]);
			mode = 'survey';
 		} else {
			flowList = advice_dict[languagePrefrence];
			mode = 'advice'
			newRecievedMessage(flowList[counter]);
 		}
 		userData['mode'] = mode;

		$.getJSON('https://ssl.geoplugin.net/json.gp?k=98dfa7e389d7989b', function(data) {
			userData['location'] = {
				'ip': data['geoplugin_request'],
				'city' : data['geoplugin_city'],
				'region' : data['geoplugin_regionName'],
				'country' : data['geoplugin_countryName'],
				'lat' : data['geoplugin_latitude'],
				'lon' : data['geoplugin_longitude']
			}
			userData['device'] = {
				'class': FRUBIL.device.class,
				'brand' : FRUBIL.device.brand,
				'model' : FRUBIL.device.marketname,
				'os' : FRUBIL.client.os,
				'medium' : FRUBIL.client.name
			}
			userData['referrer'] = document.referrer;
			$.ajax({
				type: "POST",
				url: "https://coronacheck.azurewebsites.net/visitor",
			    dataType: 'json',
 			    contentType: 'application/json; charset=utf-8',
				crossDomain: true,
				data: JSON.stringify(userData),
				success: function(responseData) {
		            console.log(responseData);		
				},
				error: function() {
				}
			});
		});

 		console.log("Flow List = ".concat(flowList));
	} else if (selectMultiple) {
		selectMultiple = false;
		userData['answers'][tags[counter]] = selected_options;
		userData['selections'][tags[counter]] = selected_id;
		userData['action_time'][tags[counter]] = +new Date;
		counter += 1;
		newRecievedMessage(flowList[counter]);
	}else if (flowList.length > counter+1) {
		if (mode=='survey'){
			userData['answers'][tags[counter]] = eval(english_options[counter])[selected_id];
			userData['selections'][tags[counter]] = selected_id;
			userData['action_time'][tags[counter]] = +new Date;			
		}
		counter += 1;
		console.log("counter ".concat(counter));
		console.log("New Message for ".concat(flowList[counter]));
		newRecievedMessage(flowList[counter]);
	} else if (mode=='survey'){
		if(ask_at == 4){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			}
		}
		console.log('inside survey')
		userData['answers'][tags[counter]] = eval(english_options[counter])[selected_id];
		userData['selections'][tags[counter]] = selected_id;
		userData['action_time'][tags[counter]] = +new Date;
		if(selected_id==0){
			if(ask_at == 5){
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(showPosition);
				}
			}
			$('.input').show();
			$('#submit').show();
			get_contact = true;
			selected_id==99;
		} else {
			if(get_contact){
				userData['name'] = input_name;
				userData['contact'] = input_number;			
			}
			newRecievedMessage(status_dict[languagePrefrence]);
			
			if(ask_at == 6){
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(showPosition);
				}
			}
			userData['submit_time'] = +new Date;
			$.ajax({

				type: "POST",
				// Change your API url here 
				// url: "https://gem.eastus2.cloudapp.azure.com/predict",
				url: "https://coronacheck.azurewebsites.net/predict",
			    dataType: 'json',
 			    contentType: 'application/json; charset=utf-8',
				crossDomain: true,
				// No authorization header required - hence removed
				// headers: {
				// 	"Authorization": "Bearer " + accessToken
				// },
				data: JSON.stringify(userData),
				success: function(responseData) {
		            console.log(responseData);
				
				// Pass the response into the method 
				setTimeout(function() { 
					$chatlogs.append(
						$('<div/>', {'class': 'risk_meter'}).append(
							$('<figure/>', {'class': 'highcharts-figure'}).append(
								$('<div/>', {'class': 'chart-container', 'id':'container-risk'}))));
				}, 2000);
				
				setTimeout(function() {
				var chartSpeed = Highcharts.chart('container-risk', Highcharts.merge(gaugeOptions, {
				    yAxis: {
				        min: 0,
				        max: 100,
						labels: {
						            style: {
										fontSize:'2vh'
									}
						        }
				    },

				    credits: {
				        enabled: false
				    },

				    series: [{
				        name: 'Risk',
				        data: [responseData.risk_score],
				        dataLabels: {
				            format:
				                '<div style="text-align:center">' +
				                '<span style="font-size:3vh">{y}% Risk</span><br/>' +
				                '</div>'
				        },
				    }]

				}));}, 2500);


				// newRecievedMessage("<br 2000>".concat(JSON.stringify(responseData.risk_score, undefined, 2)));
				newRecievedMessage(share_dict[languagePrefrence]);
				$('.share').delay(3000).show(0);
				$('.restart').delay(3000).show(0);	
				
				},
				error: function() {
					// newRecievedMessage("Processing your request...")
					newRecievedMessage("Sorry, the system is facing unexpectedly high number of requests. Please try again later.");
				}
			});			
		}
	} else {
		console.log('last')
		// $('<div/>',{'class': 'sharethis-inline-share-buttons'}).appendTo($('#inputDiv'))
		// window.__sharethis__.initialize()
		newRecievedMessage(share_dict[languagePrefrence]);
		$('.share').delay(3000).show(0);
		$('.restart').delay(3000).show(0);
	}

	console.log("User data ".concat(JSON.stringify(userData)));


	// AJAX post request, sends the users text to API.AI and 
	// calls the method newReceivedMessage with the response from API.AI

}


//----------------------User Receives Message Methods--------------------------------//


// Method called whenver there is a new recieved message
// This message comes from the AJAX request sent to API.AI
// This method tells which type of message is to be sent
// Splits between the button messages, multi messages and single message
function newRecievedMessage(messageText) {

	// Variable storing the message with the "" removed
	var removedQuotes = messageText.replace(/[""]/g,"");
	
	// Determining options type
	selectOne = removedQuotes.startsWith("single");
	selectLang = removedQuotes.startsWith("lang");
	selectOption = removedQuotes.startsWith("option");

	if(removedQuotes.startsWith("text")){
		$('input').show();
		$('#submit').show();
	} else if (removedQuotes.startsWith("multiple"))
	{
		console.log("MULTIPLE")
		$('#submit').show();
		selectMultiple = true;
	}

	// update the last message recieved variable for storage in the database
	// lastRecievedMessage = removedQuotes;
	// console.log(lastRecievedMessage)
	// If the message contains a <ar then it is a message
	// whose responses are buttons
	if(removedQuotes.includes("<ar"))
	{
		buttonResponse(removedQuotes);	
	}

	// if the message contains only <br then it is a multi line message
	else if (removedQuotes.includes("<br")) 
	{
		multiMessage(removedQuotes);
	} 

	// There arent multiple messages to be sent, or message with buttons
	else
	{	
		// Show the typing indicator
		showLoading();

		// After 3 seconds call the createNewMessage function
		setTimeout(function() {
			createNewMessage(removedQuotes);
		}, DEFAULT_TIME_DELAY);
	}
}




// Method which takes messages and splits them based off a the delimeter <br 2500>
// The integer in the delimeter is optional and represents the time delay in milliseconds
// if the delimeter is not there then the time delay is set to the default
function multiMessage(message)
{

	// Stores the matches in the message, which match the regex
	var matches;

	// List of message objects, each message will have a text and time delay
	var listOfMessages = [];
	
	// Regex used to find time delay and text of each message
	var regex = /\<br(?:\s+?(\d+))?\>(.*?)(?=(?:\<br(?:\s+\d+)?\>)|$)/g;

	// While matches are still being found in the message
	while(matches = regex.exec(message))
	{
		// if the time delay is undefined(empty) use the default time delay
		if(matches[1] == undefined)
		{
			matches[1] = DEFAULT_TIME_DELAY;
		}

		// Create an array of the responses which will be buttons
		var messageText  = matches[2].split(/<ar>/);

		// Create a message object and add it to the list of messages
		listOfMessages.push({
				text: messageText[0],
				delay: matches[1]
		});
	}


	// loop index 
	var i = 0;

	// Variable for the number of messages
	var numMessages = listOfMessages.length;

	// Show the typing indicator
	showLoading();

	// Function which calls the method createNewMessage after waiting on the message delay
	(function theLoop (listOfMessages, i, numMessages) 
	{

		// Method which executes after the timedelay
		setTimeout(function () 
		{

			// Create a new message from the server
			createNewMessage(listOfMessages[i].text);
			
			// If there are still more messages
			if (i++ < numMessages - 1) 
			{   
				// Show the typing indicator
				showLoading();             

				// Call the method again
				theLoop(listOfMessages, i, numMessages);
			}
		}, listOfMessages[i].delay);
	
	// Pass the parameters back into the method
	})(listOfMessages, i, numMessages);

}




// Method called whenever an <ar tag is found
// The responses for this type of message will be buttons
// This method parses out the time delays, message text and button responses
// Then creates a new message with the time delay and creates buttons for the responses
function buttonResponse(message)
{

	// Stores the matches in the message, which match the regex
	var matches;

	// Used to store the new HTML div which will be the button	
	var $input;

	// send the message to the multi message method to split it up, message will be sent here
	multiMessage(message);
	
	// Regex used to find time delay, text of the message and responses to be buttons
	var regex = /\<br(?:\s+?(\d+))?\>(.*?)(?=(?:\<ar(?:\s+\d+)?\>)|$)/g;

	// Seach the message and capture the groups which match the regex
	matches = regex.exec(message);

	console.log(matches);

	// Create an array of the responses which will be buttons
	var buttonList = message.split(/<ar>/);

	// Remove the first element, The first split is the actual message
	buttonList = buttonList.splice(1);

	console.log(buttonList);

	// Array which will store all of the newly created buttons
	var listOfInputs = [];

	var button_count = 0;
	// Loop through each response and create a button
	for (var index = 0; index < buttonList.length; index++)
	{
		// Store the current button response
		var response = buttonList[index];
		
		// Create a new div element with the text for the current button response
		$input = $('<div/>', {'class': 'buttonResponse', 'id':button_count}).append(
            $('<p/>', {'class': 'chat-message', 'text': response, 'id':button_count}));

		button_count +=1;
		// add the new button to the list of buttons
		listOfInputs.push($input);
	}

	// Show the typing indicator
	showLoading();
	
	// After the time delay call the createNewMessage function
	setTimeout(function() {
			
		// Hide the send button and the text area
		// $('#submit').toggle();
		// $('input').toggle();

		// Show the switch input button
		// $("#switchInputType").show();

		// For each of the button responses
		for (var index = 0; index < listOfInputs.length; index++) {
						
			// Append to the chat-form div which is at the bottom of the chatbox
			listOfInputs[index].appendTo($('#buttonDiv'));
		}

			
		
	}, matches[1]);

}




// Method to create a new div showing the text from API.AI
function createNewMessage(message) {

	// Hide the typing indicator
	hideLoading();

	// take the message and say it back to the user.
	//speechResponse(message);

	// // Show the send button and the text area
	// $('#submit').css('visibility', 'visible');
	// $('input').css('visibility', 'visible');

	// Append a new div to the chatlogs body, with an image and the text 
	$chatlogs.append(
		$('<div/>', {'class': 'chat friend'}).append(
			$('<div/>', {'class': 'user-photo'}).append($('<img src="Images/ana.JPG" />')), 
			$('<p/>', {'class': 'chat-message', 'text': message})));

	// Find the last message in the chatlogs
	var $newMessage = $(".chatlogs .chat").last();

	// Call the method to see if the message is visible
	checkVisibility($newMessage);
}




// Funtion which shows the typing indicator
// As well as hides the input and send button
function showLoading()
{
	$chatlogs.append($('#loadingGif'));
	$("#loadingGif").show();

	// $('#submit').css('visibility', 'hidden');
	// $('input').css('visibility', 'hidden');

	$('.chat-form').css('visibility', 'hidden');
 }



// Function which hides the typing indicator
function hideLoading()
{
	$('.chat-form').css('visibility', 'visible');
	$("#loadingGif").hide();

	// Clear the text area of text
	$(".input").val("");

	// reset the size of the text area
	$(".input").attr("rows", "1");
	
}



// Method which checks to see if a message is in visible
function checkVisibility(message)
{
	// Scroll the view down a certain amount
	$chatlogs.stop().animate({scrollTop: $chatlogs[0].scrollHeight});
}








//----------------------------------------- Resize the input ------------------------------------------//
$(document)
    .one('focus.input', 'input.input', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.input', 'input.input', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
	});
	
var metricWithTwoOrThreeDigit= {
	dfsc :{
		areasearch :"",
		cassandra:{
			cityavailablility : 'cityavailablility',
			decompress : 'decompress',
			execute : 'execute',
			fetch : 'fetch',
			fetchPrepared : 'fetchPrepared',
			ratesilo : 'ratesilo',
			timeout: 'timeout'
		},
		citysearch:{
			none: "",
			filtering: "filtering",
			gethoteldata: 'gethoteldata',
			sorting : 'sorting',
			sortingfiltering: 'sortingfiltering'
		},
		converthotelandsteakhouse :"",
		db : {
			citymetadata : 'citymetadata',
			exchangerate : 'exchangerate',
			hotel_facility : 'hotel_facility',
			hotelmetadata : 'hotelmetadata',
			hotelsbycity : 'hotelsbycity',
			hoteltranslatedname : 'hoteltranslatedname',
			landmarkdata : 'landmarkdata',
			manualdownlift : 'manualdownlift',
			optoutslist : 'optoutslist',
			partnerfilter : 'partnerfilter',
			radiusdata : 'radiusdata',
			review_score : 'review_score',
			steakhousedata : 'steakhousedata'
		},
		dmc : {
			FetchDmcHotels : "FetchDmcHotels",
			'request.getcityavailability2' : "request.getcityavailability2",
			'request.getresults' : "request.getresults",
			XccFetchHotels : "XccFetchHotels"
		},
		getmissingcitydmchotels : "",
		getsmallhotels : "",
		hotellist : "",
		landmarksearch : "",
		manualcalculation : {
			none : "",
			convert : "convert",
			put : "put"
		},
		radiussearch : "",
		requests : "",
		steakhouse : {
			preloadcache : "preloadcache"
		}
	},
	FE : {
		DragonFruitAPI : "",
		PagePerformance : {
			ConnectTime : 'ConnectTime',
			DnsTime : 'DnsTime',
			DomCompleteTime : 'DomCompleteTime',
			DomContentLoadedTime : 'DomContentLoadedTime',
			DomLoadTime : 'DomLoadTime',
			DomReadyTime : 'DomReadyTime',
			LoadEventTime : 'LoadEventTime',
			RedirectTime : 'RedirectTime',
			RequestTime : 'RequestTime',
			ResponseTime : 'ResponseTime',
			FetchStart_ConnectEnd : "FetchStart_ConnectEnd",
			FetchStart_RequestEnd : "FetchStart_RequestEnd",
			FetchStart_ResponseEnd : "FetchStart_ResponseEnd",
			FetchStart_DomContentLoadEventStart : "FetchStart_DomContentLoadEventStart",
			FetchStart_DomComplete : "FetchStart_DomComplete",
			FetchStart_DomInteractive : "FetchStart_DomInteractive",
			PreFetchLatency : "PreFetchLatency",
			ConnectTime_V2 : "ConnectTime_V2",
			SendRequestTime : "SendRequestTime",
			SendResponseTime : "SendResponseTime",
			ServerProcessingTime : "ServerProcessingTime",
			DOMInteractive : "DOMInteractive",
			PageUserReady : "PageUserReady",
			DOMComplete : "DOMComplete",
			PageLoadTime : "PageLoadTime"
		},
		Performance : {
			Breakdown : 'Breakdown'
		},
		RoundRobinStats : {
			CDBs : 'CDBs'
		}
	},
	rhtest : {
		testData : {
			'14' : 14, 
			'15' : 15,
			'19' : 19,
			'21' : 21,
			'22' : 22,
			'23' : 23,
			'4' : 4
		}
	},
	MSE : {
		SsrMvc : 'SsrMvc',
		CitySearch : 'CitySearch'
	}
};

var metricValue1,metricValue2,metricValue3;

function getSelectedItemFromMetricDropDownList(){
	var metricDropdownList = document.getElementById("metricList");
	var metricDropdownList2 = document.getElementById("metricList2");
	var metricDropdownList3 = document.getElementById("metricList3");
	metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	metricValue3 = metricDropdownList3.options[metricDropdownList3.selectedIndex].text;
	if(metricValue2 === "none"){
		return metricValue1;
	}else if(metricValue2 !== "none" && metricValue3 === "none"){
		return metricValue1+"."+metricValue2;
	}else{
		return metricValue1+"."+metricValue2+"."+metricValue3;
	}
};

function getSelectedItemFromGraphMetricDropDownList(){
	var metricDropdownList = document.getElementById("metricGraphList");
	var metricDropdownList2 = document.getElementById("metricGraphList2");
	var metricDropdownList3 = document.getElementById("metricGraphList3");
	metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	metricValue3 = metricDropdownList3.options[metricDropdownList3.selectedIndex].text;
	if(metricValue2 === "none"){
		return metricValue1;
	}else if(metricValue2 !== "none" && metricValue3 === "none"){
		return metricValue1+"."+metricValue2;
	}else{
		return metricValue1+"."+metricValue2+"."+metricValue3;
	}
};

function autoGenerateSecondDigitMetricFromFirstDigit(){
	var metricDropdownList = document.getElementById("metricList");
	metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var secondLevelObj = metricWithTwoOrThreeDigit[metricValue1];
	var metricDropdownList2 = document.getElementById("metricList2");
	metricDropdownList2.innerHTML = ""; 
	if(typeof secondLevelObj !== 'undefined'){
		var optionVal = 2;
		for(var key in secondLevelObj){
			var option = document.createElement('option');
			option.setAttribute('value', optionVal);
			optionVal = optionVal+1;
			option.innerHTML = key;
			$(option).appendTo("#metricList2");
		}
	}else{
		var option = document.createElement('option');
		option.setAttribute('value', 1);
		option.innerHTML = "none";
		$(option).appendTo("#metricList2");
	}
	document.getElementById("metricList3").innerHTML = "";
	var option2 = document.createElement('option');
	option2.setAttribute('value', 1);
	option2.innerHTML = "none";
	$(option2).appendTo("#metricList3");
	$('#metricList2').selectpicker('refresh');
	$('#metricList3').selectpicker('refresh');
};

function autoGenerateThirdDigitMetricFromSecondDigit(){
	var metricDropdownList = document.getElementById("metricList");
	metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var secondLevelObj = metricWithTwoOrThreeDigit[metricValue1];
	var metricDropdownList2 = document.getElementById("metricList2");
	metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	var thirdLevelObj = secondLevelObj[metricValue2];
	var metricDropdownList3 = document.getElementById("metricList3");
	metricDropdownList3.innerHTML = "";
	if(typeof thirdLevelObj !== 'undefined'){
		if(thirdLevelObj === ""){
			var option = document.createElement('option');
			option.setAttribute('value', 1);
			option.innerHTML = "none";
			$(option).appendTo("#metricList3");
		}else{
			var optionVal = 2;
			for(var key in thirdLevelObj){
				var option = document.createElement('option');
				option.setAttribute('value', optionVal);
				optionVal = optionVal+1;
				option.innerHTML = key;
				$(option).appendTo("#metricList3");
			}
		}
	}else{
		var option = document.createElement('option');
		option.setAttribute('value', 1);
		option.innerHTML = "none";
		$(option).appendTo("#metricList3");
	}
	$('#metricList3').selectpicker('refresh')
};

function autoGenerateSecondDigitMetricFromFirstDigitForGraph(){
	var metricDropdownList = document.getElementById("metricGraphList");
	metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var secondLevelObj = metricWithTwoOrThreeDigit[metricValue1];
	var metricDropdownList2 = document.getElementById("metricGraphList2");
	metricDropdownList2.innerHTML = ""; 
	if(typeof secondLevelObj !== 'undefined'){
		var optionVal = 2;
		for(var key in secondLevelObj){
			var option = document.createElement('option');
			option.setAttribute('value', optionVal);
			optionVal = optionVal+1;
			option.innerHTML = key;
			$(option).appendTo("#metricGraphList2");
		}
	}else{
		var option = document.createElement('option');
		option.setAttribute('value', 1);
		option.innerHTML = "none";
		$(option).appendTo("#metricGraphList2");
	}
	document.getElementById("metricGraphList3").innerHTML = "";
	var option2 = document.createElement('option');
	option2.setAttribute('value', 1);
	option2.innerHTML = "none";
	$(option2).appendTo("#metricGraphList3");
	$('#metricGraphList2').selectpicker('refresh');
	$('#metricGraphList3').selectpicker('refresh');
};

function autoGenerateThirdDigitMetricFromSecondDigitForGraph(){
	var metricDropdownList = document.getElementById("metricGraphList");
	metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var secondLevelObj = metricWithTwoOrThreeDigit[metricValue1];
	var metricDropdownList2 = document.getElementById("metricGraphList2");
	metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	var thirdLevelObj = secondLevelObj[metricValue2];
	var metricDropdownList3 = document.getElementById("metricGraphList3");
	metricDropdownList3.innerHTML = "";
	if(typeof thirdLevelObj !== 'undefined'){
		if(thirdLevelObj === ""){
			var option = document.createElement('option');
			option.setAttribute('value', 1);
			option.innerHTML = "none";
			$(option).appendTo("#metricGraphList3");
		}else{
			var optionVal = 2;
			for(var key in thirdLevelObj){
				var option = document.createElement('option');
				option.setAttribute('value', optionVal);
				optionVal = optionVal+1;
				option.innerHTML = key;
				$(option).appendTo("#metricGraphList3");
			}
		}
	}else{
		var option = document.createElement('option');
		option.setAttribute('value', 1);
		option.innerHTML = "none";
		$(option).appendTo("#metricGraphList3");
	}
	$('#metricGraphList3').selectpicker('refresh')
};
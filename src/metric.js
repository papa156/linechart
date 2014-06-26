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
			ResponseTime : 'ResponseTime'
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
	}
}

function getSelectedItemFromMetricDropDownList(){
	var metricDropdownList = document.getElementById("metricList");
	var metricDropdownList2 = document.getElementById("metricList2");
	var metricDropdownList3 = document.getElementById("metricList3");
	var metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	var metricValue3 = metricDropdownList3.options[metricDropdownList3.selectedIndex].text;
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
	var metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	var metricValue3 = metricDropdownList3.options[metricDropdownList3.selectedIndex].text;
	if(metricValue2 === "none"){
		return metricValue1;
	}else if(metricValue2 !== "none" && metricValue3 === "none"){
		return metricValue1+"."+metricValue2;
	}else{
		return metricValue1+"."+metricValue2+"."+metricValue3;
	}
};
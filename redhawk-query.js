var serverUrlList = {
	"DEV - Development" : "http://as-agdpapi-3001.agprod2.agoda.local:48090/rest/measurements",
	"HKG - Hong Kong": "http://dev.www.agoda.com:8081/rest/measurements",
	"ASH - Ashbourne":"",
	"AMS - Amsterdam":""
};

var requestObject = {};

$("#getRadio").click(function(){
	$("#dataSetTextBox").attr("disabled",true);
	$(".dataset-text-box").attr("data-original-title","avaliable with getsets");
	$(".dataset-label").attr("data-original-title","avaliable with getsets");
});

$("#getSetsRadio").click(function(){
	$("#dataSetTextBox").removeAttr("disabled");
	$(".dataset-text-box").attr("data-original-title","seperate by comma");
	$(".dataset-label").attr("data-original-title","seperate by comma");
});



function getSelectedItemFromServerDropDownList(){
	var serverDropdownList = document.getElementById("serverList");
	return serverDropdownList.options[serverDropdownList.selectedIndex].text;
};

function getSelectedItemFromMetricDropDownList(){
	var metricDropdownList = document.getElementById("metricList");
	return metricDropdownList.options[metricDropdownList.selectedIndex].text;
};

function getValueFromGranularityTextBox(){
	var granularity = $(".granularity-text-box").val();
	var granularityInt;
	if(granularity === ""){
		alert("Granularity is mandatory");
		return;
	}
	granularityInt = parseInt(granularity);
	if (isNaN(granularityInt)){
        alert("Granularity value is not integer");
        return;
    }
	return granularityInt;  
};

function getValueFromStartDateAndTimePicker(){
	var startDate = $(".start-date-time-value").val();
	if(startDate === ""){
		alert("Start date Information is mandatory");
		return;
	}
	//var startDate = startDate.substring(startDate.indexOf(" ")+1,startDate.length);
	return startDate;  
};

function getValueFromEndtDateAndTimePicker(){
	var endDate = $(".end-date-time-value").val();
	if(endDate === ""){
		alert("End date Information is mandatory");
		return;
	}
	//var endDate = endDate.substring(endDate.indexOf(" ")+1,endDate.length);
	return endDate;  
};

function getValueClusterTextBox(){
	var cluster = $(".cluster-text-box").val();
	if(cluster === ""){
		alert("Cluster Information is mandatory");
		return;
	}
	var clusterList = cluster.split(',');
	return clusterList; 
};

function getStateFromRadioCheckBox(){
	var getRadio = document.getElementById("getRadio");
	var getSetsRadio = document.getElementById("getSetsRadio");
	var getRadioState = getRadio.checked;
	var getSetsRadioState = getSetsRadio.checked;
	return {getRadioState:getRadioState,getSetsRadioState:getSetsRadioState}
};

function getDatasetsForGetSets(){
	var dataSetsVal = $(".dataset-text-box").val();
	if(dataSetsVal === ""){
		alert("datasets is mandatory in getsets");
		return;
	}
	var dataSetsList = dataSetsVal.split(',');
	return dataSetsList; 
};

function getPageFromPageTextBox(){
	var pageVal = $(".page-text-box").val();
	if(pageVal === ""){
		return;
	}
	var pageList = pageVal.split(',');
	return pageList; 
};

function getPlatformFromPlatformTextBox(){
	var platformVal = $(".platform-text-box").val();
	if(platformVal === ""){
		return;
	}
	var platformList = platformVal.split(',');
	return platformList; 
};

function generateFullAPIUrl(selectedOption,getRadioState,getSetsRadioState){
	var serverUrl = serverUrlList[selectedOption];
	if(getRadioState === false && getSetsRadioState === false){
		alert("You need to choose one query method");
		return;
	}else if(getRadioState === true){
		serverUrl = serverUrl + "/get";
		$("#dataSetTextBox").removeAttr("disabled");
	}else if(getSetsRadioState === true){
		serverUrl = serverUrl + "/getsets";
		$("#dataSetTextBox").attr("disabled");
	}
	return serverUrl;
};

function getValueFromTextArea(){
	var textAreaVal = $(".query-input-textarea").val();
	if(textAreaVal === ""){
		return;
	}
	return textAreaVal;  
};

function requestQueryResult(serverUrl,inputQuery,callback){
	$.ajax({
		type: "POST",
		url:serverUrl,
		contentType: 'application/json; charset=utf-8',
        dataType: "json",
        data : inputQuery,
        crossDomain : true
    }).fail(function(jqXHR, textStatus, errorThrown){
    	alert("Query fail");
	}).done(function(result,status){
		callback(result);
	});
	
};

function updateResult(result){
	$(".result-text-area").text(JSON.stringify(result, null, "\t"));
};

function setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster){
	requestObject.metric = metricSelectedOption;
	requestObject.granularity = granularity;
	requestObject.start = startDate;
	requestObject.end = endDate;
	requestObject.tags = {
		cluster:[
			cluster
		]
	};
	var requestObjectString = JSON.stringify(requestObject);
	console.log(requestObjectString,typeof requestObjectString);
	requestQueryResult(serverUrl,requestObjectString,function(result){
		updateResult(result);
	});
};

function setGetSetsRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,datasetList){
	requestObject.metric = metricSelectedOption;
	requestObject.granularity = granularity;
	requestObject.start = startDate;
	requestObject.end = endDate;
	requestObject.tags = {
		cluster:[
		]
	};
	for(var i=0;i<cluster.length;i++){
		requestObject.tags.cluster.push(cluster[i]);
	}
	var requestObjectString = JSON.stringify(requestObject);
	console.log(requestObjectString,typeof requestObjectString);
	requestQueryResult(serverUrl,requestObjectString,function(result){
		updateResult(result);
	});
};


$(".submit-button").click(function(){
	var serverSelectedOption = getSelectedItemFromServerDropDownList();
	var metricSelectedOption = getSelectedItemFromMetricDropDownList();
	var granularity = getValueFromGranularityTextBox();
	if(typeof granularity === "undefined"){
		return;
	}
	var raioStateList = getStateFromRadioCheckBox();
	var getRadioState = raioStateList.getRadioState;
	var getSetsRadioState = raioStateList.getSetsRadioState;
	var serverUrl = generateFullAPIUrl(serverSelectedOption,getRadioState,getSetsRadioState);

	var startDate=getValueFromStartDateAndTimePicker();
	var endDate=getValueFromEndtDateAndTimePicker();

	var cluster=getValueClusterTextBox();

	if(getRadioState === true){
		var page=getPageFromPageTextBox();
		var platform=getPlatformFromPlatformTextBox();
		setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster);
	}else if(getSetsRadioState === true){
		var datasetList=getDatasetsForGetSets();
		console.log(datasetList);
		setGetSetsRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,datasetList);
	}
	

	

	// var inputQuery = getValueFromTextArea();
	// if(typeof inputQuery !=="undefined"){
	// 	// requestQueryResult(serverUrl,inputQuery,function(result){
	// 	// 	updateResult(result);
	// 	// });
	// 	requestQueryResult(serverUrl,inputQuery,function(result){
	// 		updateResult(result);
	// 	});
	// }else{
	// 	return;
	// }


});





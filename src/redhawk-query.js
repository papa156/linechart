var serverUrlList = {
	"DEV - Development" : "http://as-agdpapi-3001.agprod2.agoda.local:48090/rest/measurements",
	"HKG - Hong Kong": "http://dev.www.agoda.com:8081/rest/measurements",
	"ASH - Ashbourne":"",
	"AMS - Amsterdam":""
};

var requestObject = {};

var getFlag;

function showLoadingModal(){
	$(".loading-screen").fadeIn();
};

function hideLoadingModal(){
	$(".loading-screen").fadeOut();
};

function resizingCanvas(){
	var canvas = document.getElementById("myChart");
	if($(window).height() <= 768 && $(window).width()<=1366){
		canvas.width = 750;
		canvas.height = 480;
	}else{
		canvas.width = 1000;
		canvas.height = 600;
	}
};

function setFlashMessage(status,message){
	if(status === "success"){
		$(".flash-alert-message").removeClass("alert-danger").addClass("alert-success");
		$(".alert-link").css("color","#169E3C");

	}else if(status === "error"){
		$(".flash-alert-message").removeClass("alert-success").addClass("alert-danger");
		$(".alert-link").css("color","#a94442");
	}
	$(".alert-link").html(message);
	$(".flash-alert-message").show();
	$(".flash-alert-message").delay(2000).fadeOut();
};

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
		setFlashMessage("error","Granularity is mandatory");
		return;
	}
	granularityInt = parseInt(granularity);
	if (isNaN(granularityInt)){
		setFlashMessage("error","Granularity value is not integer");
        return;
    }
	return granularityInt;  
};

function getValueFromStartDateAndTimePicker(){
	var startDate = $(".start-date-time-value").val();
	if(startDate === ""){
		setFlashMessage("error","Start date Information is mandatory");
		if(getFlag === true){
			$("#dataSetTextBox").attr("disabled",true);
		}
		return;
	}
	//var startDate = startDate.substring(startDate.indexOf(" ")+1,startDate.length);
	return startDate;  
};

function getValueFromEndDateAndTimePicker(){
	var endDate = $(".end-date-time-value").val();
	if(endDate === ""){
		setFlashMessage("error","End date Information is mandatory");
		if(getFlag === true){
			$("#dataSetTextBox").attr("disabled",true);
		}
		return;
	}
	//var endDate = endDate.substring(endDate.indexOf(" ")+1,endDate.length);
	return endDate;  
};

function getValueClusterTextBox(){
	var cluster = $(".cluster-text-box").val();
	if(cluster === ""){
		setFlashMessage("error","Cluster Information is mandatory");
		if(getFlag === true){
			$("#dataSetTextBox").attr("disabled",true);
		}
		return;
	}
	var clusterList = cluster.split(',');
	return clusterList; 
};

function getStateFromRadioCheckBox(){
	var getRadio = document.getElementById("getRadio");
	var getSetsRadio = document.getElementById("getSetsRadio");
	getFlag = getRadio.checked;
	var getRadioState = getRadio.checked;
	var getSetsRadioState = getSetsRadio.checked;
	return {getRadioState:getRadioState,getSetsRadioState:getSetsRadioState}
};

function getDatasetsForGetSets(){
	var dataSetsVal = $(".dataset-text-box").val();
	if(dataSetsVal === ""){
		setFlashMessage("error","Datasets is mandatory in getsets");
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
		setFlashMessage("error","You need to choose one query method");
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
		hideLoadingModal();
    	setFlashMessage("error","Query fail");
	}).done(function(result,status){
		hideLoadingModal();
		setFlashMessage("success", "Query success");
		callback(result);
	});
	
};

function updateResult(result){
	$(".result-text-area").text(JSON.stringify(result, null, "\t"));
	$(".plot-graph-shortcut-button").show();
};

function setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,page,platform){
	requestObject.metric = metricSelectedOption;
	requestObject.granularity = granularity;
	requestObject.start = startDate;
	requestObject.end = endDate;
	requestObject.tags = {
		cluster:[
			cluster
		]
	};
	if(typeof page !== "undefined"){
		requestObject.tags.page = [];
		for(var i=0;i<page.length;i++){
			requestObject.tags.page.push(page[i]);
		}
	}
	if(typeof platform !== "undefined"){
		requestObject.tags.platform = [];
		for(var i=0;i<platform.length;i++){
			requestObject.tags.platform.push(platform[i]);
		}
	}
	var requestObjectString = JSON.stringify(requestObject);
	requestQueryResult(serverUrl,requestObjectString,function(result){
		updateResult(result);
	});
};

function setGetSetsRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,datasetList,page,platform){
	requestObject.requests={};
	for(var i=0;i<datasetList.length;i++){
		requestObject.requests[datasetList[i]] = {};
		requestObject.requests[datasetList[i]].metric = metricSelectedOption;
		requestObject.requests[datasetList[i]].granularity = granularity;
		requestObject.requests[datasetList[i]].start = startDate;
		requestObject.requests[datasetList[i]].end = endDate;
		requestObject.requests[datasetList[i]].tags = {
			cluster:[
				cluster[i]
			]
		};
		if(typeof page !== "undefined"){
			requestObject.requests[datasetList[i]].tags.page = [];
			for(var j=0;j<page.length;j++){
				requestObject.requests[datasetList[i]].tags.page.push(page[j]);
			}
		}
		if(typeof platform !== "undefined"){
			requestObject.requests[datasetList[i]].tags.platform = [];
			for(var j=0;j<platform.length;j++){
				requestObject.requests[datasetList[i]].tags.platform.push(platform[j]);
			}
		}
	}
	var requestObjectString = JSON.stringify(requestObject);
	requestQueryResult(serverUrl,requestObjectString,function(result){
		updateResult(result);
	});
};

function getValueFromQueryResultTextArea(){
	var textAreaVal = $(".result-text-area").val();
	return JSON.parse(textAreaVal);  
};


$("#getRadio").click(function(){
	$("#dataSetTextBox").attr("disabled",true);
	$(".dataset-text-box").attr("title","avaliable with getsets");
	$(".dataset-label").attr("title","avaliable with getsets");
	$(".dataset-text-box").attr("data-original-title","avaliable with getsets");
	$(".dataset-label").attr("data-original-title","avaliable with getsets");
});

$("#getSetsRadio").click(function(){
	$("#dataSetTextBox").removeAttr("disabled");
	$(".dataset-text-box").attr("title","seperate by comma, insert in order");
	$(".dataset-label").attr("title","seperate by comma, insert in order");
	$(".dataset-text-box").attr("data-original-title","seperate by comma, insert in order");
	$(".dataset-label").attr("data-original-title","seperate by comma, insert in order");
});


$(".submit-button").click(function(e){
	e.preventDefault();
	$(".query-result").show();
	$(".graph-result").hide();

	requestObject={};
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
	if(typeof startDate === "undefined"){
		return;
	}
	var endDate=getValueFromEndDateAndTimePicker();
	if(typeof endDate === "undefined"){
		return;
	}

	var cluster=getValueClusterTextBox();
	if(typeof cluster === "undefined"){
		return;
	}

	var page=getPageFromPageTextBox();
	var platform=getPlatformFromPlatformTextBox();

	showLoadingModal();

	if(getRadioState === true){
		$("#dataSetTextBox").attr("disabled",true);
		setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,page,platform);
	}else if(getSetsRadioState === true){
		$("#dataSetTextBox").removeAttr("disabled");
		var datasetList=getDatasetsForGetSets();
		setGetSetsRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,datasetList,page,platform);
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


$(".plot-graph-shortcut-button").click(function(e){
	e.preventDefault();
	resizingCanvas();
	var queryResult = getValueFromQueryResultTextArea();
	if(typeof queryResult !=="undefined"){
		if(typeof queryResult.dataSets !== "undefined"){
			removeLabel();
			var labelList = plotMultipleGraph(queryResult.dataSets);
			renderLabel(labelList);
		}else{
			plotOneGraph(queryResult);
		}

	}
	$(".plot-graph-shortcut-button").hide();
	$(".query-result").hide();
	$(".graph-result").show();
	// $('#collapseTwo').collapse('show');
	// $('#collapseOne').collapse('hide');
});


$("#redhawkQueryHader").click(function(){
	$(".query-result").show();
	$(".graph-result").hide();
});






var serverUrlList = {
	"HKG - APP" : "http://hk-agdpapi-2001:80/rest/measurements",
	"HKG - DMZ" : "http://hk-agdpapi-2001:80/rest/measurements",
	"HKG - DEV" : "http://hk-agdpcc-2001:38090/rest/measurements",
	//"HKG - DEV" : "http://hk-agdpgc-2003.hkg.agoda.local:38091/rest/measurements <http://hk-agdpgc-2003.hkg.agoda.local:38091/rest/measurements/tagnames", 
	"AMS - DMZ":"http://am-agdpapi-4001:80/rest/measurements",
	"AMS - APP":"http://am-agdpapi-4001:80/rest/measurements",
	"ASH - FE":"http://as-agdpapi-3001:80/rest/measurements"
};

var requestObject = {};

var getFlag;

var serverSelectedOption = getSelectedItemFromServerDropDownList();
var metricSelectedOption = getSelectedItemFromMetricDropDownList();

var serverUrl = serverUrlList[serverSelectedOption];
generateOptionalSectionFromSelectedMetric(metricSelectedOption,serverUrl);

function getSelectedItemFromServerDropDownList(){
	var serverDropdownList = document.getElementById("serverList");
	return serverDropdownList.options[serverDropdownList.selectedIndex].text;
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


function updateResult(result){
	$(".result-text-area").text(JSON.stringify(result, null, "\t"));
	$(".plot-graph-shortcut-button").show();
};



// 
var graphRequestObject = {};

var dataPointButtonTopOffset = 200;

var graphContainerSumOfChildNode;

function getSelectedItemFromGraphMetricDropDownList(){
	var metricDropdownList = document.getElementById("metricGraphList");
	return metricDropdownList.options[metricDropdownList.selectedIndex].text;
};

function getStateFromGraphRadioCheckBox(){
	var getRadio = document.getElementById("getRadioGraph");
	var getSetsRadio = document.getElementById("getSetsRadioGraph");
	var getRadioState = getRadio.checked;
	var getSetsRadioState = getSetsRadio.checked;
	return {getRadioState:getRadioState,getSetsRadioState:getSetsRadioState}
};

function getValueFromGraphGranularityTextBox(){
	var granularity = $(".granularity-text-graph-box").val();
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

function setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,page,platform){
	graphRequestObject.metric = metricSelectedOption;
	graphRequestObject.granularity = granularity;
	graphRequestObject.dataPoints = [];
	graphRequestObject.measurementStat = {};
};

$("#getRadioGraph").click(function(e){
	$(".datapoints-button-container").hide();
	graphContainerSumOfChildNode = document.getElementById("dataPointGraphContainer").childNodes.length;
	for(var i=graphContainerSumOfChildNode;i>5;i--){
		$("#dataPointGraphContainer").children().last().remove();
		var addDataPointHeight = $("#dataPointTextBox").height();
		graphContainerSumOfChildNode = graphContainerSumOfChildNode-1;
		dataPointButtonTopOffset = dataPointButtonTopOffset-addDataPointHeight-20;
		$(".datapoints-button-container").css("top",dataPointButtonTopOffset);
		console.log(document.getElementById("dataPointGraphContainer").childNodes.length);
	}
	// while(graphContainerSumOfChildNode>5){
	// 	$("#dataPointGraphContainer").children().last().remove();
	// 	graphContainerSumOfChildNode = graphContainerSumOfChildNode -1;
	// 	var addDataPointHeight = $("#dataPointTextBox").height();
	// 	dataPointButtonTopOffset = dataPointButtonTopOffset-addDataPointHeight-20;
	// 	$(".datapoints-button-container").css("top",dataPointButtonTopOffset);
	// }
});

$("#getSetsRadioGraph").click(function(e){
	$(".datapoints-button-container").show();
});

$(".add-datapoints-button-container").click(function(){
	var addDataPointHeight = $("#dataPointTextBox").height();
	$("#dataPointTextBox").clone().appendTo(".dataPoint-graph-container");
	dataPointButtonTopOffset = dataPointButtonTopOffset+addDataPointHeight+20;
	$(".datapoints-button-container").css("top",dataPointButtonTopOffset);
});

$(".delete-datapoints-button-container").click(function(){
	var graphContainerSumOfChildNodeLocal = document.getElementById("dataPointGraphContainer").childNodes.length;
	if(typeof graphContainerSumOfChildNode !== 'undefined'){
		if(graphContainerSumOfChildNode !== graphContainerSumOfChildNodeLocal){
			graphContainerSumOfChildNodeLocal = graphContainerSumOfChildNode;
		}
	}
	if(graphContainerSumOfChildNodeLocal<=5){
		return;
	}
	var addDataPointHeight = $("#dataPointTextBox").height();
	$("#dataPointGraphContainer").children().last().remove();
	dataPointButtonTopOffset = dataPointButtonTopOffset-addDataPointHeight-20;
	$(".datapoints-button-container").css("top",dataPointButtonTopOffset);
});

$(".submit-graph-button").click(function(e){
	e.preventDefault();
	var raioStateList = getStateFromRadioCheckBox();
	var getRadioState = raioStateList.getRadioState;
	var getSetsRadioState = raioStateList.getSetsRadioState;

	var metricSelectedOption = getSelectedItemFromGraphMetricDropDownList();
	var granularity = getValueFromGraphGranularityTextBox();
	if(typeof granularity === "undefined"){
		return;
	}

	if(getRadioState === true){
		$("#dataSetTextGraphBox").attr("disabled",true);
		//setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,page,platform);
	}else if(getSetsRadioState === true){
		$("#dataSetTextGraphBox").removeAttr("disabled");
		var datasetList=getDatasetsForGetSets();
		//setGetSetsRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,cluster,datasetList,page,platform);
	}

});
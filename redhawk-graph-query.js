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

function setGetGraphRequestObject(metricSelectedOption,granularity,dataPointList){
	graphRequestObject.metric = metricSelectedOption;
	graphRequestObject.granularity = granularity;
	graphRequestObject.dataPoints = [];
	graphRequestObject.measurementStat = {};
	graphRequestObject.dataPoints = dataPointList;
	plotOneGraph(graphRequestObject);
};

function setGetSetsGraphRequestObject(metricSelectedOption,granularity,dataPointList,datasetList){
	graphRequestObject.dataSets = {};
	for (var i = datasetList.length - 1; i >= 0; i--) {
		graphRequestObject.dataSets[datasetList[i]] = {};
		graphRequestObject.dataSets[datasetList[i]].metric = metricSelectedOption;
		graphRequestObject.dataSets[datasetList[i]].granularity = granularity;
		graphRequestObject.dataSets[datasetList[i]].measurementStat = {};
		graphRequestObject.dataSets[datasetList[i]].dataPoints = dataPointList[i];
	};
	removeLabel();
	var labelList = plotMultipleGraph(graphRequestObject.dataSets);
	renderLabel(labelList);
};

function preFromatDatapoints(dataPoints){
	var dataPointsList = [];
	var index=0;
	dataPointsList = dataPoints.split("}");
	dataPointsList.pop();
	dataPointsList[0] = JSON.parse(dataPointsList[0] + "}");
	for(var i=1;i<dataPointsList.length;i++){
		dataPointsList[i] = dataPointsList[i].substring(1,dataPointsList[i].length);
		dataPointsList[i] = JSON.parse(dataPointsList[i]+"}");
	}
	return dataPointsList;
};

function getValueFromMultipleDatasetsTextArea(){
	var dataPointsListOfList = [];
	var dataPointsDOM = document.getElementById("dataPointGraphContainer");
	for(var i=0;i<dataPointsDOM.children.length;i++){
		if(dataPointsDOM.children[i].tagName.toLowerCase() === "textarea"){
			if(typeof dataPointsDOM.children[i].value !== "undefined"){
				var dataPoints = preFromatDatapoints(dataPointsDOM.children[i].value);
				dataPointsListOfList.push(dataPoints);
			}
		}
	}
	return dataPointsListOfList;
};

function getDatasetsForGraphGetSets(){
	var dataSetsVal = $(".dataset-text-graph-box").val();
	if(dataSetsVal === ""){
		setFlashMessage("error","Datasets is mandatory in getsets");
		return;
	}
	var dataSetsList = dataSetsVal.split(',');
	return dataSetsList; 
};

$("#getRadioGraph").click(function(e){
	$(".datapoints-button-container").hide();
	graphContainerSumOfChildNode = document.getElementById("dataPointGraphContainer").children.length;
	for(var i=graphContainerSumOfChildNode;i>2;i--){
		$("#dataPointGraphContainer").children().last().remove();
		var addDataPointHeight = $("#dataPointTextBox").height();
		graphContainerSumOfChildNode = graphContainerSumOfChildNode-1;
		dataPointButtonTopOffset = dataPointButtonTopOffset-addDataPointHeight-20;
		$(".datapoints-button-container").css("top",dataPointButtonTopOffset);
	}

	$("#dataSetTextGraphBox").attr("disabled",true);
	$(".dataset-text-graph-box").attr("data-original-title","avaliable with getsets");
	$(".dataset-graph-label").attr("data-original-title","avaliable with getsets");
});

$("#getSetsRadioGraph").click(function(e){
	$(".datapoints-button-container").show();
	$("#dataSetTextGraphBox").removeAttr("disabled");
	$(".dataset-text-graph-box").attr("data-original-title","seperate by comma, insert in order");
	$(".dataset-graph-label").attr("data-original-title","seperate by comma, insert in order");
});

$(".add-datapoints-button-container").click(function(){
	var addDataPointHeight = $("#dataPointTextBox").height();
	$("#dataPointTextBox").clone().appendTo(".dataPoint-graph-container");
	dataPointButtonTopOffset = dataPointButtonTopOffset+addDataPointHeight+20;
	$(".datapoints-button-container").css("top",dataPointButtonTopOffset);
});

$(".delete-datapoints-button-container").click(function(){
	var graphContainerSumOfChildNodeLocal = document.getElementById("dataPointGraphContainer").children.length;
	// if(typeof graphContainerSumOfChildNode !== 'undefined'){
	// 	if(graphContainerSumOfChildNode !== graphContainerSumOfChildNodeLocal){
	// 		graphContainerSumOfChildNodeLocal = graphContainerSumOfChildNode;
	// 	}
	// }
	if(graphContainerSumOfChildNodeLocal<=2){
		return;
	}
	var addDataPointHeight = $("#dataPointTextBox").height();
	$("#dataPointGraphContainer").children().last().remove();
	dataPointButtonTopOffset = dataPointButtonTopOffset-addDataPointHeight-20;
	$(".datapoints-button-container").css("top",dataPointButtonTopOffset);
});

$("#redhawkGraphHader").click(function(){
	$(".query-result").hide();
	$(".graph-result").show();
});

$(".submit-graph-button").click(function(e){
	e.preventDefault();
	graphRequestObject = {};
	var raioStateList = getStateFromGraphRadioCheckBox();
	var getRadioState = raioStateList.getRadioState;
	var getSetsRadioState = raioStateList.getSetsRadioState;

	var metricSelectedOption = getSelectedItemFromGraphMetricDropDownList();
	var granularity = getValueFromGraphGranularityTextBox();
	if(typeof granularity === "undefined"){
		return;
	}

	if(getRadioState === true){
		$("#dataSetTextGraphBox").attr("disabled",true);
		var dataPoints = $(".dataPoint-text-graph-box").val();
		var dataPointList = preFromatDatapoints(dataPoints);
		setGetGraphRequestObject(metricSelectedOption,granularity,dataPointList);
	}else if(getSetsRadioState === true){
		$("#dataSetTextGraphBox").removeAttr("disabled");
		var dataPointsListOfList = getValueFromMultipleDatasetsTextArea();
		var datasetList = getDatasetsForGraphGetSets();
		setGetSetsGraphRequestObject(metricSelectedOption,granularity,dataPointsListOfList,datasetList);
	}

	$(".query-result").hide();
	$(".graph-result").show();


});


var graphRequestObject = {};

var dataPointButtonTopOffset = 200;

var graphContainerSumOfChildNode;


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
		setGraphFlashMessage("error","Granularity is mandatory");
		return;
	}
	granularityInt = parseInt(granularity);
	if (isNaN(granularityInt)){
		setGraphFlashMessage("error","Granularity value is not integer");
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
			if(dataPointsDOM.children[i].value !== ""){
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
		setGraphFlashMessage("error","Datasets is mandatory in getsets");
		return;
	}
	var dataSetsList = dataSetsVal.split(',');
	return dataSetsList; 
};


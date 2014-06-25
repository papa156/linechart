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
	$(".dataset-text-graph-box").attr("title","avaliable with getsets");
	$(".dataset-graph-label").attr("title","avaliable with getsets");
	$(".dataset-text-graph-box").attr("data-original-title","avaliable with getsets");
	$(".dataset-graph-label").attr("data-original-title","avaliable with getsets");
});

$("#getSetsRadioGraph").click(function(e){
	$(".datapoints-button-container").show();
	$("#dataSetTextGraphBox").removeAttr("disabled");
	$(".dataset-text-graph-box").attr("title","seperate by comma, insert in order");
	$(".dataset-graph-label").attr("title","seperate by comma, insert in order");
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
		if(dataPoints === ""){
			setGraphFlashMessage("error","Data points is mandatory");
			return;
		}
		var dataPointList = preFromatDatapoints(dataPoints);
		setGetGraphRequestObject(metricSelectedOption,granularity,dataPointList);
	}else if(getSetsRadioState === true){
		$("#dataSetTextGraphBox").removeAttr("disabled");
		var datasetList = getDatasetsForGraphGetSets();
		if(typeof datasetList === "undefined"){
			return;
		}
		var dataPointsListOfList = getValueFromMultipleDatasetsTextArea();
		if(dataPointsListOfList.length === 0){
			setGraphFlashMessage("error", "Data points is mandatory");
			return;
		}
		setGetSetsGraphRequestObject(metricSelectedOption,granularity,dataPointsListOfList,datasetList);
	}
	setGraphFlashMessage("success", "Query success");
	$(".query-result").hide();
	$(".graph-result").show();
});


$("#getRadio").click(function(){
	$(".tags-button-container").hide();
	graphContainerSumOfChildNode = document.getElementById("optionalSection").children.length;
	for(var i=graphContainerSumOfChildNode;i>3;i--){
		$("#optionalSection").children().last().remove();
		// var addDataPointHeight = $("#dataPointTextBox").height();
		// graphContainerSumOfChildNode = graphContainerSumOfChildNode-1;
		// dataPointButtonTopOffset = dataPointButtonTopOffset-addDataPointHeight-20;
		// $(".datapoints-button-container").css("top",dataPointButtonTopOffset);
	}

	$(".optional-tag-container").css("top","26px");
	$("#dataSetTextBox").attr("disabled",true);
	$(".dataset-text-box").attr("title","avaliable with getsets");
	$(".dataset-label").attr("title","avaliable with getsets");
	$(".dataset-text-box").attr("data-original-title","avaliable with getsets");
	$(".dataset-label").attr("data-original-title","avaliable with getsets");
});

$("#getSetsRadio").click(function(){
	$(".tags-button-container").show();
	$(".optional-tag-container").css("top","90px");
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
	if(getRadioState === true){
		var tags = generateTagFilterObjectFromOptionalSectionForGetMethod();
		$("#dataSetTextBox").attr("disabled",true);
		showLoadingModal();
		setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,tags);
	}else if(getSetsRadioState === true){
		$("#dataSetTextBox").removeAttr("disabled");
		var datasetList=getDatasetsForGetSets();
		var tagsList = generateTagFilterObjectFromOptionalSectionForGetSetsMethod();
		if(typeof datasetList === "undefined"){
			return;
		}
		showLoadingModal();
		setGetSetsRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,tagsList,datasetList);
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
		if(jQuery.isEmptyObject(queryResult)){
			setFlashMessage("error","There are no data in return result");
			return;
		}else if(typeof queryResult.dataSets !== "undefined"){
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
});


$("#redhawkQueryHader").click(function(){
	$(".query-result").show();
	$(".graph-result").hide();
});


$( "#metricList" ).change(function() {
	metricSelectedOption = getSelectedItemFromMetricDropDownList();
	var serverUrl = serverUrlList[serverSelectedOption];
	generateOptionalSectionFromSelectedMetric(metricSelectedOption,serverUrl);
});

$( "#metricList2" ).change(function() {
	metricSelectedOption = getSelectedItemFromMetricDropDownList();
	var serverUrl = serverUrlList[serverSelectedOption];
	generateOptionalSectionFromSelectedMetric(metricSelectedOption,serverUrl);
});

$( "#metricList3" ).change(function() {
	metricSelectedOption = getSelectedItemFromMetricDropDownList();
	var serverUrl = serverUrlList[serverSelectedOption];
	generateOptionalSectionFromSelectedMetric(metricSelectedOption,serverUrl);
});

$( "#serverList" ).change(function() {
	serverSelectedOption = getSelectedItemFromServerDropDownList();
});

$(".add-tags-button-container").click(function(){
	var originalTagFilterHeight = $("#optionalTagContainer").height();
	var originalTagFilterGroup = $("#optionalTagContainer");
	var cloneTagFilterGroup = originalTagFilterGroup.clone();
	cloneTagFilterGroup.appendTo(".optional-section");
	cloneTagFilterGroup.css("top",originalTagFilterHeight+50).css("position","relative");
	cloneTagFilterGroup.find('.bootstrap-select').remove();
	cloneTagFilterGroup.find('select').selectpicker({dropupAuto:false});
});

$(".delete-tags-button-container").click(function(){
	var graphContainerSumOfChildNodeLocal = document.getElementById("optionalSection").children.length;
	if(graphContainerSumOfChildNodeLocal<=3){
		return;
	}
	$("#optionalSection").children().last().remove();
});

$(".start-date-time-value").change(function(){
	var startDate = $(".start-date-time-value").val();
	if($(".end-date-time-value").val() === ""){
		var firstColon = startDate.indexOf(":");
		var minutes = parseInt(startDate.substring(firstColon+1,firstColon+3));
		var hour = parseInt(startDate.substring(firstColon-2,firstColon));
		var endMinutes = minutes +30;
		var endDate;
		if(endMinutes >= 60){
			var endHour = hour+1;
			var leftoverMinute = endMinutes-60;
			var firstSection = startDate.substring(0,firstColon-2);
			var lastSection = startDate.substring(firstColon+3,startDate.length);
			var leftoverMinuteString = leftoverMinute.toString();
			var endHourString = endHour.toString();
			if(leftoverMinute<10){
				leftoverMinuteString = "0"+leftoverMinuteString;
			}
			if(endHour<10){
				endHourString = "0"+endHourString;
			}
			if(endHour>=24){
				endHour = 0;
				endHourString = "0"+endHour.toString();
			}
			var middleSection = endHourString + ":"+leftoverMinuteString;
			endDate = firstSection + middleSection+lastSection;
		}else{
			var endMinutesString = endMinutes.toString();
			var firstSection = startDate.substring(0,firstColon+1);
			var lastSection = startDate.substring(firstColon+3,startDate.length);
			endDate = firstSection + endMinutesString+lastSection;
		}
		$(".end-date-time-value").val(endDate);
	}
});
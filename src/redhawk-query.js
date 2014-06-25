var serverUrlList = {
	"DEV - Development" : "http://as-agdpapi-3001.agprod2.agoda.local:48090/rest/measurements",
	"HKG - Hong Kong": "http://hk-agdpapi-2001:38090/rest/measurements",
	"ASH - Ashbourne":"http://as-agdpapi-3001:38090/rest/measurements",
	"AMS - Amsterdam":"http://am-agdpapi-4001:38090/rest/measurements"
};

var requestObject = {};

var getFlag;

var serverSelectedOption = getSelectedItemFromServerDropDownList();
var metricSelectedOption = getSelectedItemFromMetricDropDownList();

var serverUrl = serverUrlList[serverSelectedOption];
generateOptionalSectionFromSelectedMetric(metricSelectedOption,serverUrl);

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

function generateOptionalSectionFromSelectedMetric(metric,serverUrl){
	var metricObj = {
		metric : metric
	};
	var requestServerURL = serverUrl+"/tagnames";
	requestAvaliableTagResult(requestServerURL,JSON.stringify(metricObj),function(tagnameList){
		attachOptionalDOMTagNamestoPage(tagnameList,metric,serverUrl);
	});
};

function requestAvaliableTagResult(serverUrl,inputQuery,callback){
	$.ajax({
		type: "POST",
		url:serverUrl,
		contentType: 'application/json; charset=utf-8',
        dataType: "json",
        data : inputQuery,
        crossDomain : true
    }).fail(function(jqXHR, textStatus, errorThrown){
		
	}).done(function(result,status){
		callback(result);
	});
	
};
function createLILabelInnerHtml(tagname,liTagClass){
	var tagnameElement = document.createElement('div');
	tagnameElement.setAttribute('class', 'optional-'+tagname+"-container");
	tagnameElement.innerHTML =tagname + " : ";
	tagnameElement.style.width = "100px";
	tagnameElement.style.height = "35px";
	tagnameElement.style.top = "-5px";
	tagnameElement.style.left = "7px";
	tagnameElement.style.position = "relative";
	tagnameElement.style.display = "inline-block";
	$(tagnameElement).appendTo("."+liTagClass);
};

function createOptionalLILabelFromTagnames(tagname,metric,serverUrl){
	var tagnameElement = document.createElement('li');
	tagnameElement.setAttribute('class', 'optional-li-'+tagname+"-container");
	//tagnameElement.innerHTML =tagname + " : ";
	tagnameElement.style.width = "100%";
	tagnameElement.style.height = "40px";
	tagnameElement.style.position = "relative";
	tagnameElement.style.left = "0";
	$(tagnameElement).appendTo(".optional-tag-container");
	createLILabelInnerHtml(tagname,'optional-li-'+tagname+"-container");
	createOptionalDropDownListFromTagname(tagname,'optional-li-'+tagname+"-container",metric,serverUrl);

};

function createOptionalDropDownListOption(tagname,liTagClass,tagValues){
	var tagValuesList = tagValues.names;
	for(var i=0;i<tagValuesList.length;i++){
		var tagnameElement = document.createElement('option');
		tagnameElement.setAttribute('value', i+2);
		tagnameElement.innerHTML =tagValuesList[i];
		$(tagnameElement).appendTo("."+liTagClass);
	}
	$('.selectpicker').selectpicker();
	$('.selectpicker').selectpicker('refresh');
}	

function createOptionalDropDownListFromTagname(tagname,liTagClass,metric,serverUrl){
	var tagnameElement = document.createElement('select');
	tagnameElement.setAttribute('class', 'optional-select-'+tagname+'-list');
	tagnameElement.setAttribute('data-width', '240px');
	tagnameElement.setAttribute('data-live-search', true);
	tagnameElement.setAttribute('data-size', 8); 
	tagnameElement.setAttribute('multiple', true);
	tagnameElement.innerHTML =tagname + " : ";
	tagnameElement.style.width = "100px";
	tagnameElement.style.height = "30px";
	tagnameElement.style.position = "absolute";
	tagnameElement.style.top = "2px";
	tagnameElement.style.left = "101px";
	$(tagnameElement).appendTo("."+liTagClass);
	$("."+'optional-select-'+tagname+'-list').addClass('selectpicker');
	var requestServerURL = serverUrl + "/tagvalues";
	var metricObj ={
		metric : metric,
		tag : tagname
	};
	requestAvaliableTagResult(requestServerURL,JSON.stringify(metricObj),function(tagValues){
		createOptionalDropDownListOption(tagname,'optional-select-'+tagname+'-list',tagValues);
	});
};


function attachOptionalDOMTagNamestoPage(tagnameList,metric,serverUrl){
	var optionalUL = document.getElementById("optionalTagContainer");
	optionalUL.innerHTML = "";
	for(var tagname in tagnameList){
		if(tagname === "names"){
			var tagnameVal = tagnameList[tagname];
			for(var i=0;i<tagnameVal.length;i++){
				createOptionalLILabelFromTagnames(tagnameVal[i],metric,serverUrl);

			}
		}
	}
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

function setGetRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,tags){
	requestObject.metric = metricSelectedOption;
	requestObject.granularity = granularity;
	requestObject.start = startDate;
	requestObject.end = endDate;
	requestObject.tags = tags;
	var requestObjectString = JSON.stringify(requestObject);
	requestQueryResult(serverUrl,requestObjectString,function(result){
		updateResult(result);
	});
};

function setGetSetsRequestObject(metricSelectedOption,granularity,startDate,endDate,serverUrl,tagsList,datasetList){
	requestObject.requests={};
	for(var i=0;i<datasetList.length;i++){
		requestObject.requests[datasetList[i]] = {};
		requestObject.requests[datasetList[i]].metric = metricSelectedOption;
		requestObject.requests[datasetList[i]].granularity = granularity;
		requestObject.requests[datasetList[i]].start = startDate;
		requestObject.requests[datasetList[i]].end = endDate;
		requestObject.requests[datasetList[i]].tags = tagsList[i];
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

function generateTagFilterObjectFromOptionalSectionForGetMethod(){
	var tagObj = {
		tags : {}
	};
	var tags = tagObj.tags;
	var optionalTagContainer = document.getElementById('optionalTagContainer');
	for(var i=0;i<optionalTagContainer.children.length;i++){
		if(optionalTagContainer.children[i].tagName.toLowerCase() === "li"){
			var optionalTagFilter = optionalTagContainer.children[i].children[1];
			var optionalTagLabel = optionalTagContainer.children[i].children[0];
			if(optionalTagFilter.selectedIndex === -1){
				continue;
			}
			var optionalTagLabelKey = optionalTagLabel.innerHTML.substring(0,optionalTagLabel.innerHTML.indexOf(" "));
			tags[optionalTagLabelKey] = []; //the drop down have been selected
			for(var j=0;j<optionalTagFilter.length;j++){
			 	if(optionalTagFilter[j].selected === true){
					tags[optionalTagLabelKey].push(optionalTagFilter[j].text);
			  	}
			}
		}
	}
	return tagObj;
};

function generateTagFilterObjectFromOptionalSectionForGetSetsMethod(){
	var tagObjList = [];
	var optionalTagContainerChildren = document.getElementById('optionalSection').children;
	for(var i=0;i<optionalTagContainerChildren.length;i++){
		if(optionalTagContainerChildren[i].tagName.toLowerCase() === "ul"){
			var tagObj = {
				tags : {}
			};
			var tags = tagObj.tags;
			var optionalFilterUL = optionalTagContainerChildren[i];
			for(var j=0;j<optionalFilterUL.children.length;j++){
				if(optionalFilterUL.children[j].tagName.toLowerCase() === "li"){
					var optionalTagFilter = optionalFilterUL.children[j].children[1];
					var optionalTagLabel = optionalFilterUL.children[j].children[0];
					if(optionalTagFilter.selectedIndex === -1){
						continue;
					}
					var optionalTagLabelKey = optionalTagLabel.innerHTML.substring(0,optionalTagLabel.innerHTML.indexOf(" "));
					tags[optionalTagLabelKey] = []; //the drop down have been selected
					for(var k=0;k<optionalTagFilter.length;k++){
					 	if(optionalTagFilter[k].selected === true){
							tags[optionalTagLabelKey].push(optionalTagFilter[k].text);
					  	}
					}
				}
			}
			tagObjList.push(tagObj);
		}
	}
	return tagObjList;
};

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
	cloneTagFilterGroup.find('select').selectpicker();
});

$(".delete-tags-button-container").click(function(){
	var graphContainerSumOfChildNodeLocal = document.getElementById("optionalSection").children.length;
	if(graphContainerSumOfChildNodeLocal<=3){
		return;
	}
	$("#optionalSection").children().last().remove();
});
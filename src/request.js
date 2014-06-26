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
	var tags = {};
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
	return tags;
};

function generateTagFilterObjectFromOptionalSectionForGetSetsMethod(){
	var tagObjList = [];
	var optionalTagContainerChildren = document.getElementById('optionalSection').children;
	for(var i=0;i<optionalTagContainerChildren.length;i++){
		if(optionalTagContainerChildren[i].tagName.toLowerCase() === "ul"){
			var tags = {};
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
			tagObjList.push(tags);
		}
	}
	return tagObjList;
};
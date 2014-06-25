function generateOptionalSectionFromSelectedMetric(metric,serverUrl){
	var metricObj = {
		metric : metric
	};
	var requestServerURL = serverUrl+"/tagnames";
	requestAvaliableTagResult(requestServerURL,JSON.stringify(metricObj),function(tagnameList){
		attachOptionalDOMTagNamestoPage(tagnameList,metric,serverUrl);
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
	$('.selectpicker').selectpicker({dropupAuto:false});
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
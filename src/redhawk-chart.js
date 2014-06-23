//Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");

resizingCanvas();

function getValueFromTextArea(){
	var textAreaVal = $(".json-text-area").val();
	return JSON.parse(textAreaVal);  
};

function setHeaderLabel(metric){
	$(".performance-label").text(metric);
};

function getSumCountRatio(dataPoints){
	var sumCountRatioList = [];
	for(var i=0;i<dataPoints.length;i++){
		var sumCountRatio = dataPoints[i].sum/dataPoints[i].count;
		sumCountRatioList.push(sumCountRatio);
	}
	return sumCountRatioList;
};

function getTimeList(dataPoints){
	var timeList = [];
	for(var i=0;i<dataPoints.length;i++){
		var time = dataPoints[i].time;
		time = time.substring(time.indexOf(" ")+1,time.length);
		timeList.push(time);
	}
	return timeList;
};

function plotOneGraph(inputJSON){
	$("#graphLabel").hide();
	var metric = inputJSON.metric
	setHeaderLabel(metric);

	var dataPoints = inputJSON.dataPoints;
	var sumCountRatioList = getSumCountRatio(dataPoints);
	var timeList = getTimeList(dataPoints);

	var data = {
		labels : timeList,
		datasets : [
			{
				fillColor : "rgba(151,187,205,0)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : sumCountRatioList
			}
		]
	};

	var options = {
		scaleFontSize: 18,
		scaleLineWidth:3,
		datasetStrokeWidth:5,
		pointDotRadius:5,
		xFreq:15,
		pointDot: false
	};
	var myNewChart = new Chart(ctx).Line(data,options);
};

function plotMultipleGraph(datasets){
	//$(".performance-label").text("multiple datasets");
	$("#graphLabel").show();
	var datasetsList = [];
	var colorList = [];
	var sumCountRatioListofList = [];
	var tempDataPoint;
	var timeList;
	for(dataset in datasets){
		datasetsList.push(dataset);
		var dataPoints = datasets[dataset].dataPoints;
		tempDataPoint = dataPoints;
		var sumCountRatioList = getSumCountRatio(dataPoints);
		sumCountRatioListofList.push(sumCountRatioList);
	}
	var timeList = getTimeList(tempDataPoint);

	var graphData = {
		labels : timeList,
		datasets : []
	};

	for(var i=0;i<sumCountRatioListofList.length;i++){
		var strokeColor = randomColor();
		var pointColor = strokeColor;
		colorList.push(strokeColor);
		var tempDataset={
			fillColor : "rgba(151,187,205,0)",
			strokeColor : strokeColor,
			pointColor : pointColor,
			pointStrokeColor : "#fff",
			data : sumCountRatioListofList[i]
		}
		graphData.datasets.push(tempDataset);
	}

	var options = {
		scaleFontSize: 18,
		scaleLineWidth:3,
		datasetStrokeWidth:5,
		pointDotRadius:5,
		xFreq:15,
		pointDot: false
	};
	var myNewChart = new Chart(ctx).Line(graphData,options);

	return {datasetsList : datasetsList,colorList:colorList}
};

function randomColor(){
	var color = "rgba(";
	var r =_.random(0,255);
	var g =_.random(0,255);
	var b =_.random(0,255);
	color = color+r+","+g+","+b+",1)";
	return color;	
};

function renderDatasetList(dataset){
	var text = document.createElement('div');
	text.setAttribute('class', 'text-label');
	text.innerHTML =dataset;
	text.style.width = "100px";
	text.style.height = "15px";
	text.style.margin = "0px 0px 5px 0px";
	text.style.position = "absolute";
	$(text).appendTo(".graph-label");
};

function renderColorList(color){
	var div = document.createElement('div');
	div.style.width = "15px";
	div.style.height = "15px";
	div.style.background = color;
	div.style.margin = "0px 0px 5px 0px";
	$(div).appendTo(".graph-label");
};

function renderLabel(labelList){
	for(var i=0;i<labelList.colorList.length;i++){
		renderDatasetList(labelList.datasetsList[i]);
		renderColorList(labelList.colorList[i]);
	}
};

function removeLabel(){
	var myNode = document.getElementById("graphLabel");
	myNode.innerHTML = '';
};

$(".submit-graph-button").click(function(){
	resizingCanvas();
	if($.trim($(".json-text-area").val()) !== ""){
		var inputJSON = getValueFromTextArea();

		if(typeof inputJSON !=="undefined"){
			removeLabel();
			if(typeof inputJSON.dataSets !== "undefined"){
				var labelList = plotMultipleGraph(inputJSON.dataSets);
				renderLabel(labelList);
			}else{
				plotOneGraph(inputJSON);
			}

		}

	}
});




$(document).ready(function () {
  var heartbeatData = [];


  var basicOption = {
    title: {
      display: true,
      text: 'Heart beats Real-time Data',
      fontSize: 36
    }
  }


  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: heartbeatData,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
    

      // only keep no more than 50 points in the line chart
      const maxLen = 200;

      if (obj.beats) {
		for (property in obj.beats)  
			heartbeatData.push(obj.beats[property]);
      }
      if (heartbeatData.length > maxLen) {
        heartbeatData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});

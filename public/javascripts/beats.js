$(document).ready(function () {
  var heartbeatData = [];

  var dataset= {
    //labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    datasets: [{ 
        data: heartbeatData,
        label: "heart beats",
        borderColor: "#3e95cd",
        fill: false
      }
    ]
  }

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
    data: dataset,
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

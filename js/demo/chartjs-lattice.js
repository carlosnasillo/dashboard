$(function () {

     var lendingClubData = [
        {
            value: 501,
            color: "#a3e1d4",
            highlight: "#1ab394",
            label: "A"
        },
        {
            value: 384,
            color: "#6A3DFF",
            highlight: "#1ab394",
            label: "B"
        },
        {
            value: 376,
            color: "#dedede",
            highlight: "#1ab394",
            label: "C"
        },
        {
            value: 43,
            color: "#b5b8cf",
            highlight: "#1ab394",
            label: "D"
        },
        {
            value: 102,
            color: "#FF26F1",
            highlight: "#1ab394",
            label: "E"
        },
        {
            value: 100,
            color: "#FFE3C7",
            highlight: "#1ab394",
            label: "F"
        }

    ];

    var lendingClubOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 45, // This is 0 for Pie charts
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
        responsive: true,
    };


    var ctx = document.getElementById("lendingClubDoughnutChart").getContext("2d");
    var myNewChart = new Chart(ctx).Doughnut(lendingClubData, lendingClubOptions);


    var prosperData = [
        {
            value: 53,
            color: "#a3e1d4",
            highlight: "#1ab394",
            label: "AA"
        },
        {
            value: 276,
            color: "#dedede",
            highlight: "#1ab394",
            label: "A"
        },
        {
            value: 231,
            color: "#b5b8cf",
            highlight: "#1ab394",
            label: "B"
        },
        {
            value: 126,
            color: "#dedede",
            highlight: "#1ab394",
            label: "C"
        },
        {
            value: 43,
            color: "#b5b8cf",
            highlight: "#1ab394",
            label: "D"
        },
        {
            value: 102,
            color: "#FF26F1",
            highlight: "#1ab394",
            label: "E"
        },
        {
            value: 100,
            color: "#FFE3C7",
            highlight: "#1ab394",
            label: "HR"
        }


    ];

    var prosperOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 45, // This is 0 for Pie charts
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
        responsive: true,
    };


    var ctx = document.getElementById("prosperDoughnutChart").getContext("2d");
    var myNewChart = new Chart(ctx).Doughnut(prosperData, prosperOptions);

});
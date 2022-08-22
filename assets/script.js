$(document).ready(function () {
    $("#currentDay").text(moment().format("MMMM Do YYYY, h:mm:ss a"))

    $(".saveBtn").on("click", function () {
        console.log(this);

        var text = $(this).siblings(".entries").val();
        var time = $(this).parent().attr("id");

        localStorage.setItem(time, text);
    })

    $("#hour9 .entries").val(localStorage.getItem("hour9"));
    $("#hour10 .entries").val(localStorage.getItem("hour10"));
    $("#hour11 .entries").val(localStorage.getItem("hour11"));
    $("#hour12 .entries").val(localStorage.getItem("hour12"));
    $("#hour13 .entries").val(localStorage.getItem("hour13"));
    $("#hour14 .entries").val(localStorage.getItem("hour14"));
    $("#hour15 .entries").val(localStorage.getItem("hour15"));
    $("#hour16 .entries").val(localStorage.getItem("hour16"));
    $("#hour17 .entries").val(localStorage.getItem("hour17"));

    function timeTracker() {
        var currentHour = moment().hour();

        $(".time-block").each(function () {
            var blockHour = parseInt($(this).attr("id").split("hour")[1]);
            console.log(blockHour, currentHour)


            if (blockHour < currentHour) {
                $(this).addClass("past");
                $(this).removeClass("future");
                $(this).removeClass("present");
            }
            else if (blockHour === currentHour) {
                $(this).removeClass("past");
                $(this).addClass("present");
                $(this).removeClass("future");
            }
            else {
                $(this).removeClass("present");
                $(this).removeClass("past");
                $(this).addClass("future");
            }
        })
    }
    timeTracker();

})

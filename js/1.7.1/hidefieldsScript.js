/*! jQuery script to hide certain form fields */

$(document).ready(function() {

	//Hide the field initially
	$("#hide1").hide();
	$("#hide3").hide();


	//Show the text field only when the third option is chosen - this doesn't
	$('#accommodation').change(function() {
		if ($("#accommodation").val() == "Yes") {
			$("#hide1").show();
			$("#hide3").show();
		}
		else {
			$("#hide1").hide();
			$("#hide3").hide();

		}
	});
});
$(document).ready(function() {

	//Hide the field initially
	$("#hide2").hide();

	//Show the text field only when the third option is chosen - this doesn't
	$('#typeaccommodation').change(function() {
		if ($("#typeaccommodation").val() == "Host Family") {
			$("#hide2").show();
		}
		else {
			$("#hide2").hide();
		}
	});
});
$(document).ready(function() {

	//Hide the field initially
	$("#hide4").hide();

	//Show the text field only when the third option is chosen - this doesn't
	$('#extranights').change(function() {
		if ($("#extranights").val() == "Yes") {
			$("#hide4").show();
		}
		else {
			$("#hide4").hide();
		}
	});
});
$(document).ready(function() {

	//Hide the field initially
	$("#hide5").hide();

	//Show the text field only when the third option is chosen - this doesn't
	$('#transfer').change(function() {
		if ($("#transfer").val() == "Yes") {
			$("#hide5").show();
		}
		else {
			$("#hide5").hide();
		}
	});
});







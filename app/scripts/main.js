// jshint devel:true
var count = 1;

window.typekitLoad('hwr8lvl');

var domains = ['gmail.com', 'aol.com', 'conversionista.se'];
var secondLevelDomains = ['hotmail', 'gmail', 'conversionista']
var topLevelDomains = ['com', 'net', 'org', 'se', 'nu'];
var correctEmail;
var placeholder = ['konvertera@mera.nu', 'jag.vill@optimera.nu', 'skriv.din@epost.nu'];
var rand = placeholder[Math.floor(Math.random() * placeholder.length)];
var emailField = $('#email-1');
var statusField = $('#status');

function clearForms(){
	$('input').each(function(index){
		
		if (index === 0){
			$(this).val('');
		} else {
			$('input[type="checkbox"]').attr('checked',false).checkboxradio('refresh');
		}
	})
	console.info('Form cleared')
	getEntries();
	clearSuggestion();
}

function showSpinner(){
	$.mobile.loading( 'show', {
		text: 'Skickar...',
		textVisible: true,
		theme: 'a',
		html: ''
	});
}

function hideSpinner(){
	$.mobile.loading('hide');	
}

function submitForm(url){

	var inputValues = {
	    input_1_1: 	$('#checkbox-1a:checked').val(),
	    input_1_2: 	$('#checkbox-2a:checked').val(),
	    input_1_3: 	$('#checkbox-3a:checked').val(),
	    input_1_4: 	$('#checkbox-4a:checked').val(),
	    input_2: 	$(emailField).val()
	};

	var data = {
	    input_values: inputValues
	};
	console.log(data);
	$.ajax({
	    url: url,
	    type: 'POST',
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr, opts) {
	    	showSpinner();
	    }
	})
	.done(function (data, textStatus, xhr) {
	    
	    console.log(data);
	    
	    if (data.status === 200){

	    	$.mobile.changePage('#tack');

	    } else {

	    	hideSpinner();
	    	showMessage('info','Woops! Någonting gick fel :( – <i>' + textStatus + '</i>');

	    }
	    
	    
	}).error(function(jqXHR, textStatus, errorThrown){

		hideSpinner();		
	    showMessage('info','Woops! Någonting gick fel :( – <i>' + textStatus + '</i>');

	})
}

function getEntries(){
	$.ajax({
	    url: 'https://conversionista.se/gravityformsapi/forms/46/entries/?api_key=d5b81d3975&signature=7YGxRNlvkr4WmcOtvifDtp5%2BiVA%3D&expires=1501719968',
		type: 'GET',
	    crossDomain: true
	})
	.done(function (data) {
	    count = data.response.total_count;
		var numAnim = new CountUp('count', 0, count);
		numAnim.start(function() {});	    
	})
}

function editEmail(){
	$(emailField).val(correctEmail);
	clearSuggestion();
	toggleButton(true);
}

function clearSuggestion(){
	$(statusField).html('')
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function showMessage(type, msg){
	console.info(msg);
	$(statusField).html('<span class="animated shake ' + type + '">' + msg + '</span>');
}

function mailCheck(){
	$(emailField).mailcheck({
	    domains: domains,                       // optional
	    secondLevelDomains: secondLevelDomains, // optional
	    topLevelDomains: topLevelDomains,       // optional
	    suggested: function(element, suggestion) {
	   		correctEmail = suggestion.full;
	   		$(statusField).html('<span class="animated shake">Menade du <a href="#" onclick="editEmail();">' + correctEmail + '</a>?</span>')
	    },
	    empty: function(element) {
			clearSuggestion();
	    }
	});
}

function toggleButton(x){

	if (x === true){

		$('#post').removeAttr('disabled');

	} else {

		$('#post').attr('disabled','disabled');

	}
}

$(document.body).on('keydown', 'input:text, input[type=password], input[type=email]', function (e) { 
	// Android maps the "Go" button to the Enter key => key code 13
	if (e.keyCode == 13) {
		return false; 
	}
});




$(emailField).on('blur', function() {
	if (validateEmail($(this).val())){
		
		toggleButton(true);

		mailCheck();


	} else if ( $(this).val() !== '') {
		
		$(emailField).mailcheck({
		    
		    domains: domains,                       // optional
		    secondLevelDomains: secondLevelDomains, // optional
		    topLevelDomains: topLevelDomains,       // optional
		    
		    suggested: function(element, suggestion) {
		   		correctEmail = suggestion.full;
		   		$(statusField).html('<span class="animated shake">Menade du <a href="#" onclick="editEmail();">' + correctEmail + '</a>?</span>')
		    },
		    empty: function(element) {
				showMessage('info','Oj. Vi uppfattade inte din epostadress. Testa igen.');
				toggleButton(false);
				
		    }
		});
		
	}
  
});

$(document).on('pagebeforeshow','#main',function(){ // When entering main
	clearForms();
});

$(document).on('pageshow','#main',function(){ // When entering main
	$(emailField).attr('placeholder', rand).focus();
	toggleButton(false);

});

$(document).on('pageshow','#tack',function(){ // When entering main
	setTimeout(function(){
		$.mobile.changePage('#main');
	}, 5000);

});


$('#post').click(function () {

	if (validateEmail( $(emailField).val() ) === true) {

		var url = 'https://conversionista.se/gravityformsapi/forms/46/submissions/?api_key=d5b81d3975&signature=M94PyFc0%2BKkTdjvWfZVqf%2B2aLv0%3D&expires=1501715997';
    	submitForm( url );

	} else {

		toggleButton(false);
		showMessage('info','Oj. Vi förstår inte vad du menar, vänligen kolla igenom dina uppgifter.');

	}

    
});

$('#tack').click(function () {
    $.mobile.changePage('#main');
});

$( document ).ready(function() {
	jQuery('h1.headline').fitText(1.2, { minFontSize: '20px', maxFontSize: '60px' });	
	jQuery('h4.headline').fitText(1, { minFontSize: '20px', maxFontSize: '38px' });	
	$(emailField).attr('placeholder', rand);
	getEntries();
	toggleButton(false);
});
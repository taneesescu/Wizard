jQuery(document).ready(function() {
	$('#spinner').hide()
	isNumber = function(evt) {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}

	var tbl_fullName = document.getElementById('tbl_fullName');
	var tbl_AnnualIncomeGoal = document.getElementById('tbl_AnnualIncomeGoal');
	var tbl_DesiredIncomeYear = document.getElementById('tbl_DesiredIncomeYear');
	var tbl_Age = document.getElementById('tbl_Age');
	var tbl_MONTHLYinvestment = document.getElementById('tbl_MONTHLYinvestment');
	var tbl_email = document.getElementById('tbl_email');

	function PreviewValue(){
		tbl_fullName.innerText = `${$('#fname').val()} ${$('#lname').val()}`
		tbl_AnnualIncomeGoal.innerText = `$${$('#annualincomegoal').val()}`
		tbl_DesiredIncomeYear.innerText = $('#years').val()
		tbl_Age.innerText = $('#age').val()
		tbl_MONTHLYinvestment.innerText = `$${$('#monthlyamount').val()}`
		tbl_email.innerText = $('#email').val()
	}
	const f = new Intl.NumberFormat("en-us", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	  });

	  
    // click on next button
	jQuery('.form-wizard-next-btn').click(function() {
		var parentFieldset = jQuery(this).parents('.wizard-fieldset');

		if(parentFieldset[0].elements.email){
			var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if(!($('#email').val().match(mailformat)))
			{
				$('#emailValdiation').show();
				nextWizardStep = false;
				return false;
			}
		}

		var currentActiveStep = jQuery(this).parents('.form-wizard').find('.form-wizard-steps .active');
		var next = jQuery(this);
		var nextWizardStep = true;
		parentFieldset.find('.wizard-required').each(function(){
			var thisValue = jQuery(this).val();

			if( thisValue == "") {
				jQuery(this).siblings(".wizard-form-error").slideDown();
				nextWizardStep = false;
			}
			else {				
				jQuery(this).siblings(".wizard-form-error").slideUp();
			}
		});

		if( nextWizardStep) {
			fname = $('#fname').val()
			$('#firstname').text(fname)
			PreviewValue()

			next.parents('.wizard-fieldset').removeClass("show","400");
			currentActiveStep.removeClass('active').addClass('activated').next().addClass('active',"400");
			next.parents('.wizard-fieldset').next('.wizard-fieldset').addClass("show","400");
			jQuery(document).find('.wizard-fieldset').each(function(){
				if(jQuery(this).hasClass('show')){
					var formAtrr = jQuery(this).attr('data-tab-content');
					jQuery(document).find('.form-wizard-steps .form-wizard-step-item').each(function(){
						if(jQuery(this).attr('data-attr') == formAtrr){
							jQuery(this).addClass('active');
							var innerWidth = jQuery(this).innerWidth();
							var position = jQuery(this).position();
							jQuery(document).find('.form-wizard-step-move').css({"left": position.left, "width": innerWidth});
						}else{
							jQuery(this).removeClass('active');
						}
					});
				}
			});
		}
	});
     //click on previous button
	jQuery('.form-wizard-previous-btn').click(function() {
		var counter = parseInt(jQuery(".wizard-counter").text());;
		var prev =jQuery(this);
		var currentActiveStep = jQuery(this).parents('.form-wizard').find('.form-wizard-steps .active');
		prev.parents('.wizard-fieldset').removeClass("show","400");
		prev.parents('.wizard-fieldset').prev('.wizard-fieldset').addClass("show","400");
		currentActiveStep.removeClass('active').prev().removeClass('activated').addClass('active',"400");
		jQuery(document).find('.wizard-fieldset').each(function(){
			if(jQuery(this).hasClass('show')){
				var formAtrr = jQuery(this).attr('data-tab-content');
				jQuery(document).find('.form-wizard-steps .form-wizard-step-item').each(function(){
					if(jQuery(this).attr('data-attr') == formAtrr){
						jQuery(this).addClass('active');
						var innerWidth = jQuery(this).innerWidth();
						var position = jQuery(this).position();
						jQuery(document).find('.form-wizard-step-move').css({"left": position.left, "width": innerWidth});
					}else{
						jQuery(this).removeClass('active');
					}
				});
			}
		});
	});
	//click on form submit button
	jQuery(document).on("click",".form-wizard .form-wizard-submit" , function(){
		debugger
		fname = `${$('#fname').val()} ${$('#lname').val()}`
		//lname = $('#lname').val()

		AnnualIncomeGoal = parseFloat($('#annualincomegoal').val())

		Four_per = parseFloat(AnnualIncomeGoal/0.04)
		Three_per= parseFloat(AnnualIncomeGoal/0.03)

		doorNeeded = (AnnualIncomeGoal/12/150);
		doorNeededHigher = (AnnualIncomeGoal/12/200);
        
		COC_MonthlyAmountInvestment_in = parseFloat($('#monthlyamount').val())
		COC_MonthlyAmountInvestment = 0.08

		MoneyNeedsToHave = parseFloat(AnnualIncomeGoal/COC_MonthlyAmountInvestment);
		var  mulResult = (COC_MonthlyAmountInvestment * 0.50)
		MoneyNeedsToRise = parseFloat((AnnualIncomeGoal)/mulResult);

		PassiveIncomeGoalYear = $('#years').val()
		Age = $('#age').val()
		Email = $('#email').val()
		
		//post API
		var wholeYears ='0';
		var wholeMonths ='0';
		var APIError = false

		var desiredIN = (AnnualIncomeGoal/12)
		data = {
			contribution: COC_MonthlyAmountInvestment_in, 
			desiredIncome: desiredIN
		}
		function postData(){
			$('#spinner').show()
			return new Promise((resolve, reject) => {
				$.ajax({
					url: "https://iriscalculators.azurewebsites.net/api/IncomeAcceleratorYears", 
					type: "POST",
					dataType: "json",
					async:false,
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify(data),
					success: function (result) {
						if(result){
							wholeYears = result.wholeYears
							wholeMonths = result.wholeMonths
							resolve(result);
						}
					},
					error: function (err) {
						APIError=true;
						resolve([]);
						//reject(err)
					}
				}); 
			  })	
		}
		dataa = postData();
		dataa.then(()=>{
		const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib
		async function modifyPdf() {
		// Fetch an existing PDF document
		const url = 'https://rawcdn.githack.com/taneesescu/Wizard/094980f018f292aa814cdf3d9e83349c85797317/CustomReportv3.pdf'
			const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
		const pdfDoc = await PDFDocument.load(existingPdfBytes)
		const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
		const pages = pdfDoc.getPages()
		const firstPage = pages[0]
		const { width, height } = firstPage.getSize()
			SetChar = function(Text,x,y){
				firstPage.drawText(Text.toString(), {
					x: x,
					y: y,
					size: 10,
					font: helveticaFont,
					color: rgb(0, 0,0),
					//rotate: degrees(-45),
				})
			}

			SetChar2 = function(Text,x,y){
				firstPage.drawText(Text.toString(), {
					x: x,
					y: y,
					size: 13,
					font: helveticaFont,
					color: rgb(0, 0,0),
					//rotate: degrees(-45),
				})
			}
			//first name 
			SetChar(fname,70,495);
			//last name
			SetChar(Age,240,495);
			//Annual income
			SetChar(f.format(AnnualIncomeGoal.toFixed(2)),225,467);
			//Passive incomegoals year
			SetChar(PassiveIncomeGoalYear,225,438)
			//month to Invest
			//SetChar(f.format(COC_MonthlyAmountInvestment_in.toFixed(2)),140,413)
			//month to achieve
			SetChar(f.format(COC_MonthlyAmountInvestment_in.toFixed(2)),708,414)
	
			
			if(APIError){
				SetChar2("Greater than 20 years",555,370)	
			}else{
				SetChar2(`${wholeYears} years and ${wholeMonths} months`,544,370)
				//SetChar(wholeMonths,629,370)
			}
			//4%
			SetChar(f.format(Four_per.toFixed(2)),90,104)
			//3%
			SetChar(f.format(Three_per.toFixed(2)),90,45)
			//doorNeeded
			SetChar(Math.ceil(doorNeededHigher),300,107)
			//doorNeededHigher
			SetChar(Math.ceil(doorNeeded),380,107)
			//MoneyNeedsToHave
			SetChar(f.format(MoneyNeedsToHave.toFixed(2)),545,146)
			//MoneyNeedsToRise
			SetChar(f.format(MoneyNeedsToRise.toFixed(2)),545,45)
	
			const pdfBytes = await pdfDoc.save()
			download(pdfBytes, `${fname} Report.pdf`, "application/pdf");
			$('#spinner').hide()
		}
		modifyPdf()
		
		}).catch((value) => {
			console.log('Something went wrong')
		});
		window.location.href='[url to landing page]';
	});

	// focus on input field check empty or not
	jQuery(".form-control").on('focus', function(){
		var tmpThis = jQuery(this).val();
		if(tmpThis == '' ) {
			jQuery(this).parent().addClass("focus-input");
		}
		else if(tmpThis !='' ){
			jQuery(this).parent().addClass("focus-input");
		}
	}).on('blur', function(){
		var tmpThis = jQuery(this).val();
		if(tmpThis == '' ) {
			jQuery(this).parent().removeClass("focus-input");
			jQuery(this).siblings('.wizard-form-error').slideDown("3000");
		}
		else if(tmpThis !='' ){
			jQuery(this).parent().addClass("focus-input");
			jQuery(this).siblings('.wizard-form-error').slideUp("3000");
		}
	});
});


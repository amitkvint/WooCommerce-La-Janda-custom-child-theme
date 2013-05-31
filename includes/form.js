
var aCoursesData = new Object();

var aAccData = new Object();

var oTimer;

Event.observe(window, 'load', function()
{
	showLoader();

	$A($$('.calendar')).each(function(oInput)
	{
		if(
			oInput.id != 'calendar_insuranceDateFrom' && 
			oInput.id != 'calendar_insuranceDateTill' && 
			oInput.id != 'calendar_transArrDate' && 
			oInput.id != 'calendar_transDepDate'
		)
		{
			Calendar.prepare({
				dateField      : oInput.id,
				triggerElement : oInput.id.replace(/calendar_/, 'calendar_img_')
			});
		}
	});

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Course observer

	if($('addNewCourse'))
	{
		Event.observe($('addNewCourse'), 'change', function()
		{
			addCourseBlock($('addNewCourse').value);

			$('addNewCourse').selectedIndex = 0;
		});
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Accommodation observer

	if($('addNewAccommodation'))
	{
		Event.observe($('addNewAccommodation'), 'change', function()
		{
			addAccommodationBlock($('addNewAccommodation').value);

			$('addNewAccommodation').selectedIndex = 0;
		});
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Insurance observer

	if($('insurance'))
	{
		Calendar.prepare({
			dateField		: 'calendar_insuranceDateFrom',
			triggerElement	: 'calendar_img_insuranceDateFrom',
			closeHandler	: updateInsuranceData.bindAsEventListener(this)
		});

		Calendar.prepare({
			dateField		: 'calendar_insuranceDateTill',
			triggerElement	: 'calendar_img_insuranceDateTill',
			closeHandler	: updateInsuranceData.bindAsEventListener(this)
		});

		Event.observe($('insurance_id'), 'change', function()
		{
			updateInsuranceData();
		});
		
		var oInputWeek = $('insurance_weeks');
		if(oInputWeek){
			Event.observe(oInputWeek, 'keyup', function(){
				updateInsuranceData();
			});
		}
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Transfer observer

	if($('trans_arr_from') && $('trans_arr_to') && $('trans_dep_from') && $('trans_dep_to'))
	{
		Calendar.prepare({
			dateField		: 'calendar_transArrDate',
			triggerElement	: 'calendar_img_transArrDate',
			closeHandler	: updateTransferDates.bindAsEventListener(this)
		});

		Calendar.prepare({
			dateField		: 'calendar_transDepDate',
			triggerElement	: 'calendar_img_transDepDate',
			closeHandler	: updateTransferDates.bindAsEventListener(this)
		});

		Event.observe($('transfer_type'), 'change', function()
		{
			updateTransferData('transfer_type');
		});

		Event.observe($('trans_arr_to'), 'change', function()
		{
			updateTransferData('trans_arr_to');
		});

		Event.observe($('trans_dep_to'), 'change', function()
		{
			updateTransferData('trans_dep_to');
		});

		Event.observe($('trans_arr_from'), 'change', function()
		{
			updateTransferLocations('trans_arr_to');
		});

		Event.observe($('trans_dep_from'), 'change', function()
		{
			updateTransferLocations('trans_dep_to');
		});
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Prices block observer

	if($('pricesBlock'))
	{
		Event.observe($('currency'), 'change', function()
		{
			updateCurrency();
		});
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Buttons

	if($('btn_next_page'))
	{
		Event.observe($('btn_next_page'), 'click', function()
		{
			$('action').value = 'next_page';

			$('form').submit();
		});
	}
	if($('btn_prev_page'))
	{
		Event.observe($('btn_prev_page'), 'click', function()
		{
			$('action').value = 'prev_page';

			$('form').submit();
		});
	}
	if($('btn_save'))
	{
		Event.observe($('btn_save'), 'click', function()
		{
			$('action').value = 'save';

			$('form').submit();
		});
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Print

	if($('print'))
	{
		Event.observe($('print'), 'click', function()
		{
			printPrices();
		});
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	loadData();
});

function removeImage(iBlockID)
{
	$('action').value = 'remove_image';

	$('parameter').value = iBlockID;

	$('form').submit();
}

/* ==================================================================================================== */ // Data

function loadData()
{
	sParams = 'task=get_ajax&action=load_data';

	sParams += '&page=' 	+ $F('page');

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

function loadDataCallback(oReturn)
{

	var mData = oReturn.responseText.evalJSON();

	if($('pricesBlockPrintCopy'))
	{
		$('pricesBlockPrintCopy').remove();
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Courses

	var aCourses		= new Object();
	var aAccommodations	= new Object();

	if(mData['courses'])
	{
		var aUniques = new Object();

		mData['courses'].each(function(oCourse)
		{
			aUniques['c_' + oCourse['unique']] = true;

			addCourseBlockCallback(oCourse);
		});

		$('coursesContainer').childElements().each(function(oChild)
		{
			if(!aUniques[oChild.id])
			{
				oChild.remove();
			}
		});

		aCourses = aUniques;
	}
	else if($('coursesContainer'))
	{
		$('coursesContainer').innerHTML = '';
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Accommodations

	if(mData['accommodations'])
	{
		var aUniques = new Object();

		mData['accommodations'].each(function(oAcc)
		{
			aUniques['a_' + oAcc['unique']] = true;

			addAccommodationBlockCallback(oAcc);
		});

		$('accommodationsContainer').childElements().each(function(oChild)
		{
			if(!aUniques[oChild.id])
			{
				oChild.remove();
			}
		});

		aAccommodations = aUniques;
	}
	else if($('accommodationsContainer'))
	{
		$('accommodationsContainer').innerHTML = '';
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Transfer

	if(mData['transfer'] && $('transfer_type'))
	{
		$('transfer_type').disabled = false;

		if(mData['transfer']['arr_from'])
		{
			updateTransferLocationsCallback(mData['transfer']['arr_from']);
		}
		else
		{
			$('trans_arr_to').selectedIndex = 0;

			$('trans_arr_to').disabled = true;
		}

		if(mData['transfer']['dep_from'])
		{
			updateTransferLocationsCallback(mData['transfer']['dep_from']);
		}
		else
		{
			$('trans_dep_to').selectedIndex = 0;

			$('trans_dep_to').disabled = true;
		}

		if(mData['transfer']['dates'])
		{
			if(typeof mData['transfer']['dates']['min'] != 'undefined')
			{
				$('calendar_transArrDate').value = mData['transfer']['dates']['min'];
			}
		
			if(typeof mData['transfer']['dates']['max'] != 'undefined')
			{
				$('calendar_transDepDate').value = mData['transfer']['dates']['max'];
			}

			if(mData['transfer']['dates']['min'] == '' || mData['transfer']['dates']['max'] == '')
			{
				$('transfer_type').selectedIndex = 0;

				$('transfer_type').disabled = true;
			}
		}
		else
		{
			$('transfer_type').selectedIndex = 0;

			$('transfer_type').disabled = true;
		}
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Insurance

	if(mData['insurance'] && $('insurance_id'))
	{
		$('insurance_id').value = mData['insurance']['id'];

		if(mData['insurance']['payment_type']){
			var iPaymentType = mData['insurance']['payment_type']; 
			var oDivWeekRow = $('insurance_week_row');
			
			if(oDivWeekRow ){
				if(iPaymentType == 3){
					oDivWeekRow.show();
				}else{
					oDivWeekRow.hide();
				}
			}
			
		}
		
		
		
		if(mData['insurance']['from'] || mData['insurance']['till'])
		{
			if(mData['insurance']['from'])
			{
				$('calendar_insuranceDateFrom').value = mData['insurance']['from'];
			}

			if(mData['insurance']['till'])
			{
				$('calendar_insuranceDateTill').value = mData['insurance']['till'];
			}
		}
		else
		{
			$('calendar_insuranceDateFrom').value = '';
			$('calendar_insuranceDateTill').value = '';
		}
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Prices

	if(mData['prices'])
	{
		updatePricesCallback(mData['prices']);

		if($('coursesContainer'))
		{
			$('pricesBlockCourseContainer').childElements().each(function(oChild)
			{
				if(!aCourses[oChild.id.replace(/p_/, '')])
				{
					oChild.remove();
				}

				var oDuration = $(oChild.id.replace(/p_/, '') + '_duration');

				if(oDuration && (oDuration.value == '' || oDuration.disabled))
				{
					oChild.remove();
				}

			});
		}

		if($('accommodationsContainer'))
		{
			$('pricesBlockAccommodationContainer').childElements().each(function(oChild)
			{
				if(!aAccommodations[oChild.id.replace(/p_/, '')])
				{
					oChild.remove();
				}

				var oDuration = $(oChild.id.replace(/p_/, '') + '_duration');

				if(oDuration && (oDuration.value == '' || oDuration.disabled))
				{
					oChild.remove();
				}
			});
		}
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	var aTogglerKeys = new Array('course', 'accommodation', 'Course', 'Accommodation');

	for(var n = 0; n <= 1; n++)
	{
		var sKey1 = aTogglerKeys[n];
		var sKey2 = aTogglerKeys[n + 2];

		var aToggler = $A($$('.' + sKey1 + 'BlockToggler'));

		if($('addNew' + sKey2) && $('addNew' + sKey2).up('.' + sKey1 + 'ID'))
		{
			if(aToggler.length > 1)
			{
				try
				{
					$('addNew' + sKey2).up('.' + sKey1 + 'ID').hide();
				}
				catch(e)
				{
					console.debug(e);
				}
			}
			else
			{
				try
				{
					$('addNew' + sKey2).up('.' + sKey1 + 'ID').show();
				}
				catch(e)
				{
					console.debug(e);
				}
			}
		}

		for(var i = 0; i < aToggler.length; i++)
		{
			if(aToggler[i + 2] || aToggler.length == 1)
			{
				aToggler[i].hide();
			}
			else
			{
				var oSpan = aToggler[i];

				oSpan.show();

				Event.stopObserving(oSpan, 'click');
				Event.observe(oSpan, 'click', function(sKey1, sKey2, o)
				{
					try
					{
						$('addNew' + sKey2).up('.' + sKey1 + 'ID').show()
					}
					catch(e)
					{
						console.debug(e);
					}
				}.bind(this, sKey1, sKey2));
				
			}
		}
	}

	hideLoader();
}

/* ==================================================================================================== */ // Courses

function addCourseBlock(iCourseID, iKey)
{
	showLoader();

	var sParams = 'task=get_ajax&action=add_course_block';

	sParams += '&page='			+ $F('page');
	sParams += '&course_id='	+ iCourseID;

	if(iKey)
	{
		sParams += '&unique=' + iKey;
	}

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

function addCourseBlockCallback(mData)
{
	aCoursesData[mData['unique']] = mData['options'];

	var oCopy = $('courseTemplate').clone(true);

	oCopy.style.display = 'block';

	oCopy.id = 'c_' + mData['unique'];

	if($(oCopy.id))
	{
		$(oCopy.id).replace(oCopy);
	}
	else
	{
		$('coursesContainer').insert({bottom: oCopy});
	}

	oCopy = $('c_' + mData['unique']);

	if(mData['block_error'])
	{
		oCopy.down('.courseBlock').addClassName('block_error');
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	var oTemp	= oCopy.down('#courseTemplateID');
	oTemp.value	= mData['course_id'];
	oTemp.id	= oCopy.id + '_id';

	var oCourse = $(oCopy.id + '_id');

	Event.stopObserving(oCourse, 'change');
	Event.observe(oCourse, 'change', function()
	{
		try
		{
			changeCourseData(mData['unique']);
		}
		catch(e){}
	}.bind(oCourse));

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // End

	var oTemp	= oCopy.down('#courseTemplateEnd');
	oTemp.id	= oCopy.id + '_end';

	if(mData['end'])
	{
		oTemp.innerHTML = mData['end'];
	}

	var oTemp	= oCopy.down('#courseTemplateEndTime');
	oTemp.id	= oCopy.id + '_end_time';

	if(mData['end_time'])
	{
		oTemp.value = mData['end_time'];
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Level

	var oTemp	= oCopy.down('#courseTemplateLevel');
	oTemp.id	= oCopy.id + '_level';

	var oLevel = $(oCopy.id + '_level');

	mData['levels'].each(function(oLevelData)
	{
		oLevel.insert({bottom: '<option value="' + oLevelData['id'] + '">' + oLevelData['title'] + '</option>'});
	});

	if(mData['level_id'])
	{
		oLevel.value = mData['level_id'];
	}
	else
	{
		oLevel.insert({top: '<option value=""></option>'});

		oLevel.selectedIndex = 0;
	}

	if(mData['disable_level'])
	{
		oLevel.disabled = true;
	}
	else
	{
		oLevel.disabled = false;

		Event.stopObserving(oLevel, 'change');
		Event.observe(oLevel, 'change', function()
		{
			try
			{
				changeCourseData(mData['unique']);
			}
			catch(e){}
		}.bind(oLevel));
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Units

	var oTemp	= oCopy.down('#courseTemplateUnit');
	oTemp.id	= oCopy.id + '_units';

	if(mData['units'] > 0)
	{
		oTemp.value	= mData['units'];
	}

	if(mData['unit'] == 1)
	{
		var oUnits = $(oCopy.id + '_units');

		Event.stopObserving(oUnits, 'keyup');
		Event.observe(oUnits, 'keyup', function()
		{
			try
			{
				waitForChanging(mData['unique']);
			}
			catch(e){}
		}.bind(oUnits));
	}
	else
	{
		oTemp.up('.courseUnit').hide();
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Start

	var oTemp	= oCopy.down('#courseTemplateStart');
	oTemp.id	= oCopy.id + '_start';

	$H(mData['options']).each(function(oDate, i)
	{
		if(!oDate[0].match(/[0-9]{1,}_[0-9]{1,}_[0-9]{1,}/))
		{
			return $break;
		}

		var sDisabled = '';

		if(oDate[1].disabled)
		{
			sDisabled = 'disabled="disabled"';
		}

		oTemp.insert({bottom: '<option value="' + oDate[0] + '" ' + sDisabled + '>' + oDate[1].title + '</option>'});
	});

	if(mData['start'])
	{
		oTemp.value = mData['start'];
	}
	else
	{
		oTemp.insert({top: '<option value=""></option>'});

		oTemp.selectedIndex = 0;
	}

	var oStart = $(oCopy.id + '_start');

	Event.stopObserving(oStart, 'change');
	Event.observe(oStart, 'change', function()
	{
		try
		{
			changeCourseData(mData['unique']);
		}
		catch(e){}
	}.bind(oStart));

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Weeks

	var oTemp	= oCopy.down('#courseTemplateWeeks');
	oTemp.id	= oCopy.id + '_duration';

	var oDuration = $(oCopy.id + '_duration');

	if(mData['start'] == 0)
	{
		oDuration.disabled = true;
	}

	Event.stopObserving(oDuration, 'change');
	Event.observe(oDuration, 'change', function()
	{
		try
		{
			changeCourseData(mData['unique']);
		}
		catch(e){}
	}.bind(oDuration));

	var aOptions = false;

	if(oStart.value != '')
	{
		if(aCoursesData[mData['unique']] && aCoursesData[mData['unique']][oStart.value])
		{
			aOptions = aCoursesData[mData['unique']][oStart.value];
		}
	}

	var bEmpty = true;

	for(var i = 53; i >= 1; i--)
	{
		if(
			aOptions &&
			(
				aOptions['fix'] && parseInt(aOptions['fix']) > 0 ||
				aOptions['min'] && parseInt(aOptions['min']) > 0 ||
				aOptions['max'] && parseInt(aOptions['max']) > 0
			)
		)
		{
			if(aOptions['fix'] && parseInt(aOptions['fix']) > 0)
			{
				if(i == parseInt(aOptions['fix']))
				{
					bEmpty = false;

					oTemp.insert({top: '<option value="' + i + '">' + i + '</option>'});
				}
			}
			else
			{
				if(aOptions['min'] > 0 && aOptions['max'] > 0)
				{
					if(i >= parseInt(aOptions['min']) && i <= parseInt(aOptions['max']))
					{
						bEmpty = false;

						oTemp.insert({top: '<option value="' + i + '">' + i + '</option>'});
					}
				}
				else if(aOptions['min'] > 0)
				{
					if(i >= parseInt(aOptions['min']))
					{
						bEmpty = false;

						oTemp.insert({top: '<option value="' + i + '">' + i + '</option>'});
					}
				}
				else if(aOptions['max'] > 0)
				{
					if(i <= parseInt(aOptions['max']))
					{
						oTemp.insert({top: '<option value="' + i + '">' + i + '</option>'});
					}
				}
			}
		}
		else
		{
			oTemp.insert({top: '<option value="' + i + '">' + i + '</option>'});
		}
	}

	if(bEmpty && mData['duration'] == 0)
	{
		oTemp.insert({top: '<option value=""></option>'});

		oTemp.selectedIndex = 0;
	}

	if(mData['duration'])
	{
		oTemp.value = mData['duration'];
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Modules

	var oTemp	= oCopy.down('#courseModulesTitle');
	oTemp.id	= 'courseModulesTitle_' + oCopy.id;

	var oTemp	= oCopy.down('#courseModulesContainer');
	oTemp.id	= 'courseModulesContainer_' + oCopy.id;

	var oContainer = $('courseModulesContainer_' + oCopy.id);

	if(mData['duration'] && mData['modules'] && mData['modules'].length > 0)
	{
		var oModulesTitle = $('courseModulesTitle_' + oCopy.id);

		oModulesTitle.show();

		mData['modules'].each(function(oModule)
		{
			addModulesBlock(oModule, oContainer, mData['selected_modules']);
		}.bind(mData));
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	$A($$('.courseBlockRemover')).each(function(oSpan)
	{
		Event.stopObserving(oSpan, 'click');
		Event.observe(oSpan, 'click', function()
		{
			try {
				removeBlock(oSpan.up('.courseBlock').up(), 'courses');
			}
			catch(e){}
		}.bind(oSpan));
	});
}

function changeCourseData(iUnique)
{
	showLoader();

	oTimer = null;

	var sParams = 'task=get_ajax&action=change_course_data';

	sParams += '&page='			+ $F('page');
	sParams += '&course_id='	+ $F('c_' + iUnique + '_id');
	sParams += '&level_id='		+ $F('c_' + iUnique + '_level');
	sParams += '&units='		+ $F('c_' + iUnique + '_units');
	sParams += '&start='		+ $F('c_' + iUnique + '_start');
	sParams += '&duration='		+ $F('c_' + iUnique + '_duration');
	sParams += '&unique='		+ iUnique;

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

function waitForChanging(iUnique)
{
	if(oTimer != null)
	{
		window.clearTimeout(oTimer);
	}

	oTimer = window.setTimeout('changeCourseData(' + iUnique + ')', 1000);
}

/* ==================================================================================================== */ // Modules

function addModulesBlock(oModule, oContainer, oSelected)
{
	var oCopy = $('courseModuleTemplate').clone(true);

	oCopy.style.display = 'block';

	var iBlockKey = oContainer.id.replace(/courseModulesContainer_c_/, '');

	oCopy.id = 'm_' + iBlockKey + '_' + oContainer.childNodes.length;

	oContainer.insert({bottom: oCopy});

	oCopy = $('m_' + iBlockKey + '_' + (oContainer.childNodes.length - 1));

	var sKey = oModule.from_time + '_' + oModule.module_id;

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Week title

	var oTemp	= oCopy.down('#moduleWeek');
	oTemp.id	= oCopy.id + '_moduleWeek';

	if(oModule.module_type == 1)
	{
		if(oModule.week)
		{
			oTemp.innerHTML = oTemp.innerHTML + ' ' + oModule.week + ': ' + oModule.from + ' - ' + oModule.till;
		}
		else
		{
			oTemp.hide();
		}
	}
	else
	{
		if(oContainer.childNodes.length == 1)
		{
			oTemp.innerHTML = oModule.from + ' - ' + oModule.till;
		}
		else
		{
			oTemp.hide();
		}
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Modul

	var oTemp	= oCopy.down('#moduleModuleTitle');
	oTemp.id	= oCopy.id + '_moduleModuleTitle';

	oTemp.innerHTML = oTemp.innerHTML + ' ' + oModule.module;

	var oTemp	= oCopy.down('#moduleModuleModule');
	oTemp.id	= oCopy.id + '_moduleModuleModule';

	oTemp.insert({bottom: '<option value="' + oModule.module_id + '">' + oModule.title + '</option>'});

	oTemp.selectedIndex = 0;

	var iSelectedID = 0;

	if(oSelected && oSelected[sKey] && oSelected[sKey].module_id)
	{
		iSelectedID = oTemp.selectedIndex = 1;
	}

	Event.stopObserving(oTemp, 'change');
	Event.observe(oTemp, 'change', function()
	{
		var oModul = $(oCopy.id + '_moduleModuleModule');
		var oLevel = $(oCopy.id + '_moduleLevel');

		if(oLevel.length > 1)
		{
			if(oModul.value != '')
			{
				oLevel.up('.moduleLevel').show();
			}
			else
			{
				oLevel.selectedIndex = 0;
				oLevel.up('.moduleLevel').hide();
			}
		}
		else
		{
			oLevel.selectedIndex = 0;
			oLevel.up('.moduleLevel').hide();
		}

		changeModulState(oModul, oLevel, oModule.from_time, oModule.module_id, oModule.modulegroup_id);
	}.bind(oCopy));

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Level

	var oTemp	= oCopy.down('#moduleLevel');
	oTemp.id	= oCopy.id + '_moduleLevel';

	oTemp.up('.moduleLevel').hide();

	if(oModule.levels)
	{
		var iSelected = 0;

		for(var i = 0; i < oModule.levels.length; i++)
		{
			if(
					oSelected &&
					oSelected[sKey] &&
					oSelected[sKey].module_level_id &&
					oSelected[sKey].module_level_id == oModule.levels[i]['id']
			)
			{
				iSelected = i+1;
			}

			oTemp.insert({bottom: '<option value="' + oModule.levels[i]['id'] + '">' + oModule.levels[i]['title'] + '</option>'});
		}

		oTemp.selectedIndex = iSelected;

		if(iSelectedID)
		{
			oTemp.up('.moduleLevel').show();
		}
	}
	else
	{
		oTemp.up('.moduleLevel').hide();
	}

	Event.stopObserving(oTemp, 'change');
	Event.observe(oTemp, 'change', function()
	{
		var oModul = $(oCopy.id + '_moduleModuleModule');
		var oLevel = $(oCopy.id + '_moduleLevel');

		changeModulState(oModul, oLevel, oModule.from_time, oModule.module_id, oModule.modulegroup_id);
	}.bind(oCopy));
}

function changeModulState(oModul, oLevel, iTimeFrom, iModuleID, iModuleGroupID)
{
	showLoader();

	var sParams = 'task=get_ajax&action=change_modul_state';

	var aTemp = oModul.id.split('_');

	sParams += '&page='			+ $F('page');
	sParams += '&course='		+ aTemp[1];
	sParams += '&from='			+ iTimeFrom;
	sParams += '&module_id='	+ iModuleID;
	sParams += '&group_id='		+ iModuleGroupID;
	sParams += '&level_id='		+ oLevel.value;
	sParams += '&value='		+ oModul.value;

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

/* ==================================================================================================== */ // Accommodations

function addAccommodationBlock(iAccID, iKey)
{
	showLoader();

	var sParams = 'task=get_ajax&action=add_accommodation_block';

	sParams += '&page='		+ $F('page');
	sParams += '&acc_id='	+ iAccID;

	if(iKey)
	{
		sParams += '&unique=' + iKey;
	}

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

function addAccommodationBlockCallback(mData)
{
	aAccData[mData['unique']] = mData['options'];

	var oCopy = $('accommodationTemplate').clone(true);

	oCopy.style.display = 'block';

	oCopy.id = 'a_' + mData['unique'];

	if($(oCopy.id))
	{
		$(oCopy.id).replace(oCopy);
	}
	else
	{
		$('accommodationsContainer').insert({bottom: oCopy});
	}

	oCopy = $('a_' + mData['unique']);

	if(mData['block_error'])
	{
		oCopy.down('.accommodationBlock').addClassName('block_error');
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	var oTemp	= oCopy.down('#accommodationTemplateID');
	oTemp.value	= mData['acc_id'];
	oTemp.id	= oCopy.id + '_id';

	var oAcc = $(oCopy.id + '_id');

	Event.stopObserving(oAcc, 'change');
	Event.observe(oAcc, 'change', function()
	{
		try
		{
			changeAccommodationData(oAcc);
		}
		catch(e){}
	}.bind(oAcc));

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Roomtype

	var oTemp	= oCopy.down('#accommodationTemplateRoomtype');
	oTemp.id	= oCopy.id + '_roomtype';

	$H(mData['roomtypes']).each(function(oType, i)
	{
		oTemp.insert({bottom: '<option value="' + oType[0] + '">' + oType[1].title + '</option>'});
	});

	if(mData['roomtype'])
	{
		oTemp.value = mData['roomtype'];
	}
	else
	{
		oTemp.insert({top: '<option value=""></option>'});

		oTemp.selectedIndex = 0;
	}

	var oRoomtype = $(oCopy.id + '_roomtype');

	Event.stopObserving(oRoomtype, 'change');
	Event.observe(oRoomtype, 'change', function()
	{
		changeAccommodationData(oRoomtype);
	}.bind(oRoomtype));

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Meal

	var oTemp	= oCopy.down('#accommodationTemplateMeal');
	oTemp.id	= oCopy.id + '_meal';

	if(mData['roomtype'])
	{
		$H(mData['roomtypes'][mData['roomtype']].meals).each(function(oMeal, i)
		{
			oTemp.insert({bottom: '<option value="' + oMeal[0] + '">' + oMeal[1] + '</option>'});
		});

		if(mData['meal'])
		{
			oTemp.value = mData['meal'];
		}
		else
		{
			oTemp.insert({top: '<option value=""></option>'});

			oTemp.selectedIndex = 0;
		}

		var oMeal = $(oCopy.id + '_meal');

		Event.stopObserving(oMeal, 'change');
		Event.observe(oMeal, 'change', function()
		{
			changeAccommodationData(oMeal);
		}.bind(oMeal));
	}
	else
	{
		oTemp.disabled = true;
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Start

	var oTemp	= oCopy.down('#accommodationTemplateStart');
	oTemp.id	= oCopy.id + '_start';

	var oStart = $(oCopy.id + '_start');

	if(mData['meal'] == 0 || mData['meal'] == null || mData['options'].length == 0)
	{
		oStart.disabled = true;
	}
	else
	{
		$H(mData['options']).each(function(oDate, i)
		{
			if(oDate[1]['prev'])
			{
				$H(oDate[1]['prev']).each(function(oSubDate, n)
				{
					var sDisabled = '';

					if(oSubDate[1].disabled)
					{
						sDisabled = 'disabled="disabled"';
					}

					oStart.insert({bottom: '<option class="optionExtra" value="' + oSubDate[0] + '" ' + sDisabled + '>' + oSubDate[1] + '</option>'});
				});
			}

			var sDisabled = '';

			if(oDate[1].disabled)
			{
				sDisabled = 'disabled="disabled"';
			}

			oStart.insert({bottom: '<option class="optionNonExtra" value="' + oDate[0] + '" ' + sDisabled + '>' + oDate[1].title + '</option>'});
		});

		if(mData['start'])
		{
			oStart.value = mData['start'];
		}
		else
		{
			oStart.insert({top: '<option value=""></option>'});

			oStart.selectedIndex = 0;
		}

		Event.stopObserving(oStart, 'change');
		Event.observe(oStart, 'change', function()
		{
			try
			{
				changeAccommodationData(oStart);
			}
			catch(e){}
		}.bind(oStart));
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Durations

	var oTemp	= oCopy.down('#accommodationTemplateWeeks');
	oTemp.id	= oCopy.id + '_duration';

	var oDuration = $(oCopy.id + '_duration');

	Event.stopObserving(oDuration, 'change');
	Event.observe(oDuration, 'change', function()
	{
		try
		{
			changeAccommodationData(oDuration);
		}
		catch(e){}
	}.bind(oDuration));

	if(oStart.disabled || !mData['start'])
	{
		oDuration.disabled = true;
	}
	else
	{
		if(aAccData[mData['unique']][mData['start']])
		{
			var aOptions = aAccData[mData['unique']][mData['start']];
		}
		else
		{
			var aOptions = new Object();

			$H(aAccData[mData['unique']]).each(function(oDate, i)
			{
				if(oDate[1]['prev'])
				{
					$H(oDate[1]['prev']).each(function(oSubDate, n)
					{
						if(oSubDate[0] == mData['start'])
						{
							aOptions = oDate[1];

							return $break;
						}
					});
				}

				if(aOptions['max'])
				{
					return $break;
				}
			});
		}

		for(var i = aOptions['max']; i >= 1; i--)
		{
			oDuration.insert({top: '<option value="' + i + '">' + i + '</option>'});
		}

		if(mData['duration'])
		{
			oDuration.value = mData['duration'];
		}
		else
		{
			oDuration.insert({top: '<option value=""></option>'});

			oDuration.selectedIndex = 0;
		}
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // End line

	var oTemp	= oCopy.down('#accommodationTemplateEnd');
	oTemp.id	= oCopy.id + '_end';

	var oEnd = $(oCopy.id + '_end');

	Event.stopObserving(oEnd, 'change');
	Event.observe(oEnd, 'change', function()
	{
		try
		{
			changeAccommodationData(oEnd);
		}
		catch(e){}
	}.bind(oEnd));

	if(mData['duration'])
	{
		var aOptions = aAccData[mData['unique']];

		var bAddNow = false;

		var iLoops = 0;

		$H(aOptions).each(function(oDate, i)
		{
			if(oDate[0] == oStart.value)
			{
				bAddNow = true;

				iLoops = mData['duration'];
			}
			else if(oDate[1]['prev'])
			{
				$H(oDate[1]['prev']).each(function(oSubDate, n)
				{
					if(oSubDate[0] == oStart.value)
					{
						bAddNow = true;

						iLoops = mData['duration'];

						return $break;
					}
				});
			}

			if(bAddNow)
			{
				iLoops--;

				if(iLoops != 0)
				{
					return $continue;
				}

				oEnd.insert({bottom: '<option class="optionNonExtra" value="' + oDate[1]['end']['key'] + '">' + oDate[1]['end']['value'] + '</option>'});

				if(oDate[1]['next'])
				{
					$H(oDate[1]['next']).each(function(oSubDate, n)
					{
						oEnd.insert({bottom: '<option class="optionExtra" value="' + oSubDate[0] + '">' + oSubDate[1] + '</option>'});
					});
				}
			}
		});

		if(mData['end'])
		{
			oEnd.value = mData['end'];
		}
	}
	else
	{
		oEnd.disabled = true;
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	$A($$('.accommodationBlockRemover')).each(function(oSpan)
	{
		Event.stopObserving(oSpan, 'click');
		Event.observe(oSpan, 'click', function()
		{
			try
			{
				removeBlock(oSpan.up('.accommodationBlock').up(), 'accommodations');
			}
			catch(e){}
		}.bind(oSpan));
	});
}

function changeAccommodationData(oDD)
{
	showLoader();

	var sParams = 'task=get_ajax&action=change_accommodation_data';

	var aItem = oDD.id.split('_');

	sParams += '&page='		+ $F('page');
	sParams += '&unique='	+ aItem[1];
	sParams += '&value='	+ oDD.value;
	sParams += '&element='	+ aItem[2];

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

/* ==================================================================================================== */ // Insurance

function updateInsuranceData(oCalendar)
{
	showLoader();

	if(oCalendar)
	{
		oCalendar.dateField.value = oCalendar.date.print(oCalendar.dateFormat);

		oCalendar.hide();
	}

	var sParams = 'task=get_ajax&action=update_insurance_data';

	sParams += '&page='			+ $F('page');
	sParams += '&insurance_id='	+ $F('insurance_id');
	sParams += '&from='			+ $F('calendar_insuranceDateFrom');
	sParams += '&till='			+ $F('calendar_insuranceDateTill');
	sParams += '&weeks='		+ $F('insurance_weeks');

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

/* ==================================================================================================== */ // Transfer

function updateTransferLocations(sElement)
{
	showLoader();

	$(sElement).disabled = true;

	var sParams = 'task=get_ajax&action=update_transfer_locations';

	sParams += '&page='		+ $F('page');
	sParams += '&element='	+ sElement;

	switch(sElement)
	{
		case 'trans_arr_to':
			sParams += '&value=' + $F('trans_arr_from');
			break;
		case 'trans_dep_to':
			sParams += '&value=' + $F('trans_dep_from');
			break;
	}

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

function updateTransferLocationsCallback(mData)
{
	var mValue = $F(mData.element.replace(/_to/, '_from'));

	var iSelected = 0;

	for(var i = 1; i < $(mData.element).length; i++)
	{
		if(mValue == '')
		{
			$(mData.element).options[i].disabled = false;

			continue;
		}

		if(mData.values && mData.values[mValue])
		{
			if(mData.values[mValue][$(mData.element).options[i].value])
			{
				if(mData.selected == $(mData.element).options[i].value)
				{
					iSelected = i;
				}

				$(mData.element).options[i].disabled = false;
			}
			else
			{
				$(mData.element).options[i].disabled = true;
			}
		}
		else
		{
			$(mData.element).options[i].disabled = true;
		}
	}

	$(mData.element).selectedIndex = iSelected;

	$(mData.element).disabled = false;
}

function updateTransferData(sElement)
{
	showLoader();

	var sParams = 'task=get_ajax&action=update_transfer_data';

	sParams += '&page='		+ $F('page');
	sParams += '&value='	+ $F(sElement);

	switch(sElement)
	{
		case 'transfer_type':	sParams += '&element=type';		break;
		case 'trans_arr_to':	sParams += '&element=arr_to';	break;
		case 'trans_dep_to':	sParams += '&element=dep_to';	break;
	}

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

function updateTransferDates(oCalendar)
{
	showLoader();

	if(oCalendar)
	{
		oCalendar.dateField.value = oCalendar.date.print(oCalendar.dateFormat);

		oCalendar.hide();
	}

	var sParams = 'task=get_ajax&action=update_transfer_dates';

	sParams += '&page='	+ $F('page');
	sParams += '&from='	+ $F('calendar_transArrDate');
	sParams += '&till='	+ $F('calendar_transDepDate');

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

/* ==================================================================================================== */

function removeBlock(oBlock, sType)
{
	showLoader();

	var sParams = 'task=get_ajax&action=remove_block';

	if(sType == 'courses')
	{
		var iUnique = oBlock.id.replace(/c_/, '');

		aCoursesData[iUnique] = null;
	}
	else if(sType == 'accommodations')
	{
		var iUnique = oBlock.id.replace(/a_/, '');

		aAccData[iUnique] = null;
	}

	sParams += '&page='		+ $F('page');
	sParams += '&unique='	+ iUnique;
	sParams += '&type='		+ sType;

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

/* ==================================================================================================== */ // Prices

function updateCurrency()
{
	showLoader();

	var sParams = 'task=get_ajax&action=change_currency';

	sParams += '&currency='	+ $('currency').value;
	sParams += '&page='		+ $F('page');

	new Ajax.Request('?',
	{
		method: 	'post',
		parameters:	sParams,
		onComplete:	loadDataCallback
	});
}

function updatePricesCallback(mData)
{
	if(mData['courses'] && mData['courses'].length > 0)
	{
		$('pricesBlockCourse').show();

		mData['courses'].each(function(oData)
		{
			if(!oData.title)
			{
				return $continue;
			}

			var oBlock = $('p_c_' + oData['unique']);
			
			if(!oBlock)
			{
				writePriceBlock('courses', oData);

				oBlock = $('p_c_' + oData['unique']);
			}
			else
			{
				oBlock.down('.pricesWeek').innerHTML = oData['weeks'];
				oBlock.down('.pricesSubPositionDates').innerHTML = oData['dates'];
			}

			if(oData['prices'][$F('currency')]['original'] > 0)
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = oData['prices'][$F('currency')]['formated'];
			}
			else
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = '***';
			}

			if(oBlock.down('.pricesSubPositionVats'))
			{
				if(oData['prices'][$F('currency')]['tax_original'] > 0)
				{
					oBlock.down('.pricesSubPositionVats').innerHTML =
						oData['prices'][$F('currency')]['tax_formated'] + ' (' + oData['prices'][$F('currency')]['tax_rate_formated'] + '%)';
				}
				else
				{
					oBlock.down('.pricesSubPositionVats').innerHTML = '***';
				}
			}

			if(oData['prices'] && oData['prices']['add'])
			{
				oData['prices']['add'].each(function(oAdd)
				{
					var oSub = $('p_c_' + oData['unique'] + '_' + oAdd['cost_id']);

					if(oAdd['amount'][$F('currency')])
					{
						oSub.down('.pricesSubPositionPrice').innerHTML = oAdd['amount'][$F('currency')]['formated'];
					}
					else
					{
						oSub.down('.pricesSubPositionPrice').innerHTML = '***';
					}

					if(oSub.down('.pricesSubPositionVats'))
					{
						if(oAdd['amount'][$F('currency')])
						{
							oSub.down('.pricesSubPositionVats').innerHTML =
							oAdd['amount'][$F('currency')]['tax_formated'] + ' (' + oAdd['amount'][$F('currency')]['tax_rate_formated'] + '%)';
						}
						else
						{
							oSub.down('.pricesSubPositionVats').innerHTML = '***';
						}
					}
				});
			}
		});
	}
	else
	{
		$('pricesBlockCourse').hide();
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Accommodations

	if(mData['accommodations'] && mData['accommodations'].length > 0)
	{
		$('pricesBlockAccommodation').show();

		mData['accommodations'].each(function(oData)
		{
			if(!oData.title)
			{
				return $continue;
			}

			var oBlock = $('p_a_' + oData['unique']);

			if(!oBlock)
			{
				writePriceBlock('accommodations', oData);

				oBlock = $('p_a_' + oData['unique']);
			}
			else
			{
				oBlock.down('.pricesWeek').innerHTML = oData['weeks'];
				oBlock.down('.pricesSubPositionDates').innerHTML = oData['dates'];
			}

			if(oData['prices'][$F('currency')]['extra'])
			{
				oBlock.down('.pricesSubPositionExtra').innerHTML =
					oData['prices'][$F('currency')]['extra'] + ' ' +
					oData['prices'][$F('currency')]['extra_title'];

				if(oData['prices'][$F('currency')]['extra_original'] > 0)
				{
					oBlock.down('.pricesSubPositionExtraPrice').innerHTML = oData['prices'][$F('currency')]['extra_formated'];
				}
				else
				{
					oBlock.down('.pricesSubPositionExtraPrice').innerHTML = '***';
				}

				if(oBlock.down('.pricesSubPositionExtraVats'))
				{
					if(oData['prices'][$F('currency')]['extra_tax_original'] > 0)
					{
						oBlock.down('.pricesSubPositionExtraVats').innerHTML =
						oData['prices'][$F('currency')]['extra_tax_formated'] + ' (' + oData['prices'][$F('currency')]['tax_rate_formated'] + '%)';
					}
					else
					{
						oBlock.down('.pricesSubPositionExtraVats').innerHTML = '***';
					}
				}
			}
			else
			{
				oBlock.down('.pricesSubPositionExtra').innerHTML = '';
				oBlock.down('.pricesSubPositionExtraPrice').innerHTML = '';

				if(oBlock.down('.pricesSubPositionExtraVats'))
				{
					oBlock.down('.pricesSubPositionExtraVats').innerHTML = '';
				}
			}

			if(oData['prices'][$F('currency')]['original'] > 0)
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = oData['prices'][$F('currency')]['formated'];
			}
			else
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = '***';
			}

			if(oBlock.down('.pricesSubPositionVats'))
			{
				if(oData['prices'][$F('currency')]['tax_original'] > 0)
				{
					oBlock.down('.pricesSubPositionVats').innerHTML =
					oData['prices'][$F('currency')]['tax_formated'] + ' (' + oData['prices'][$F('currency')]['tax_rate_formated'] + '%)';
				}
				else
				{
					oBlock.down('.pricesSubPositionVats').innerHTML = '***';
				}
			}

			if(oData['prices'] && oData['prices']['add'])
			{
				oData['prices']['add'].each(function(oAdd)
				{
					var oSub = $('p_a_' + oData['unique'] + '_' + oAdd['cost_id']);

					if(oAdd['amount'][$F('currency')])
					{
						oSub.down('.pricesSubPositionPrice').innerHTML = oAdd['amount'][$F('currency')]['formated'];
					}
					else
					{
						oSub.down('.pricesSubPositionPrice').innerHTML = '***';
					}

					if(oSub.down('.pricesSubPositionVats'))
					{
						if(oAdd['amount'][$F('currency')])
						{
							oSub.down('.pricesSubPositionVats').innerHTML =
							oAdd['amount'][$F('currency')]['tax_formated'] + ' (' + oAdd['amount'][$F('currency')]['tax_rate_formated'] + '%)';
						}
						else
						{
							oSub.down('.pricesSubPositionVats').innerHTML = '***';
						}
					}
				});
			}
		});
	}
	else
	{
		$('pricesBlockAccommodation').hide();
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Insurances

	if(mData['insurance'] && mData['insurance']['prices'])
	{
		$('pricesBlockInsurance').show();

		if(mData['insurance']['prices'][$F('currency')]['original'] > 0)
		{
			$('pricesSubInsurance').down('.pricesSubPositionPrice').innerHTML =
				mData['insurance']['prices'][$F('currency')]['formated'];
		}
		else
		{
			$('pricesSubInsurance').down('.pricesSubPositionPrice').innerHTML = '***';
		}

		if($('pricesSubInsurance').down('.pricesSubPositionVats'))
		{
			if(mData['insurance']['prices'][$F('currency')]['tax_original'] > 0)
			{
				$('pricesSubInsurance').down('.pricesSubPositionVats').innerHTML =
					mData['insurance']['prices'][$F('currency')]['tax_formated'] + ' (' + 
					mData['insurance']['prices'][$F('currency')]['tax_rate_formated'] + '%)';
			}
			else
			{
				$('pricesSubInsurance').down('.pricesSubPositionVats').innerHTML = '***';
			}
		}

		$('pricesSubInsurance').down('.pricesSubPositionTitle').innerHTML = mData['insurance']['title'];
		$('pricesSubInsurance').down('.pricesSubPositionDates').innerHTML = mData['insurance']['dates'];
	}
	else
	{
		$('pricesBlockInsurance').hide();
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Prices

	if(mData['transfer'] && (mData['transfer']['prices'] || mData['transfer'][1] || mData['transfer'][2]))
	{
		if(mData['transfer']['type'])
		{
			$('pricesBlockTransfer').show();

			$('pricesSubTransfer').down('.pricesSubPositionTitle').innerHTML = mData['transfer']['title'];

			if(mData['transfer']['prices'])
			{
				if(mData['transfer']['prices'][$F('currency')]['original'] > 0)
				{
					$('pricesSubTransfer').down('.pricesSubPositionPrice').innerHTML =
						mData['transfer']['prices'][$F('currency')]['formated'];
				}
				else
				{
					$('pricesSubTransfer').down('.pricesSubPositionPrice').innerHTML = '***';
				}

				if($('pricesSubTransfer').down('.pricesSubPositionVats'))
				{
					if(mData['transfer']['prices'][$F('currency')]['tax_original'] > 0)
					{
						$('pricesSubTransfer').down('.pricesSubPositionVats').innerHTML =
							mData['transfer']['prices'][$F('currency')]['tax_formated'] + ' (' + 
							mData['transfer']['prices'][$F('currency')]['tax_rate_formated'] + '%)';
					}
					else
					{
						$('pricesSubTransfer').down('.pricesSubPositionVats').innerHTML = '***';
					}
				}

				for(var i = 1; i <= 2; i++)
				{
					$('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionPrice').innerHTML = '';

					if($('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionVats'))
					{
						$('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionVats').innerHTML = '';
					}
				}
			}
			else
			{
				$('pricesSubTransfer').down('.pricesSubPositionPrice').innerHTML = '';

				if($('pricesSubTransfer').down('.pricesSubPositionVats'))
				{
					$('pricesSubTransfer').down('.pricesSubPositionVats').innerHTML = '';
				}

				for(var i = 1; i <= 2; i++)
				{
					if(mData['transfer'][i])
					{
						if(
							mData['transfer'][i] &&
							mData['transfer'][i]['prices'][$F('currency')]['original_single'] > 0
						) {
							$('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionPrice').innerHTML =
								mData['transfer'][i]['prices'][$F('currency')]['formated_single'];
						}
						else
						{
							$('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionPrice').innerHTML = '***';
						}
					}

					if($('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionVats'))
					{
						if(
							mData['transfer'][i] &&
							mData['transfer'][i]['prices'][$F('currency')]['tax_original_single'] > 0
						) {
							$('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionVats').innerHTML =
								mData['transfer'][i]['prices'][$F('currency')]['tax_formated_single'] + ' (' + 
								mData['transfer'][i]['prices'][$F('currency')]['tax_rate_formated'] + '%)';
						}
						else
						{
							$('pricesSubTransfer').down('.transPrice_' + i).down('.pricesSubPositionVats').innerHTML = '***';
						}
					}
				}
			}

			switch(mData['transfer']['type'])
			{
				case 'arr_dep':
				{
					$('pricesSubTransfer').down('.pricesSubPositionArr').innerHTML = mData['transfer']['arr_title'];
					$('pricesSubTransfer').down('.pricesSubPositionDep').innerHTML = mData['transfer']['dep_title'];

					break;
				}
				case 'arr':
				{
					$('pricesSubTransfer').down('.pricesSubPositionArr').innerHTML = mData['transfer']['arr_title'];
					$('pricesSubTransfer').down('.pricesSubPositionDep').innerHTML = '';

					break;
				}
				case 'dep':
				{
					$('pricesSubTransfer').down('.pricesSubPositionArr').innerHTML = '';
					$('pricesSubTransfer').down('.pricesSubPositionDep').innerHTML = mData['transfer']['dep_title'];

					break;
				}
			}
		}
		else
		{
			$('pricesBlockTransfer').hide();
		}
	}
	else
	{
		$('pricesBlockTransfer').hide();
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */ // Total block

	if($('totalSum'))
	{
		$('totalSum').innerHTML = mData['sum'];

		if(mData['vats'] && mData['vats'].length > 0)
		{
			var aUniques = new Object();

			mData['vats'].each(function(oVat)
			{
				if(oVat['rate'] <= 0)
				{
					return $continue;
				}

				var oBlock = $('pricesVat_' + oVat['rate']);

				aUniques['pricesVat_' + oVat['rate']] = true;

				if(!oBlock)
				{
					writePriceBlock('vat', oVat);

					oBlock = $('pricesVat_' + oVat['rate']);
				}

				oBlock.down('.pricesVatTitle').innerHTML = oVat['rate_formated'] + '% (' + oVat['sum'] + ')';
				oBlock.down('.priceRight').innerHTML = oVat['vat'];
			});

			$('pricesVatsContainer').childElements().each(function(oChild)
			{
				if(!aUniques[oChild.id])
				{
					oChild.remove();
				}
			});
		}
		else
		{
			$('pricesVatsContainer').innerHTML = '';
		}
	}

	if(mData['ones_vats'] && mData['ones_vats']['courses'].length > 0)
	{
		var aUniques = new Object();

		mData['ones_vats']['courses'].each(function(oVat)
		{
			var oBlock = $('pricesSubCourseOnes_' + oVat['cost_id']);

			aUniques['pricesSubCourseOnes_' + oVat['cost_id']] = true;

			if(!oBlock)
			{
				writePriceBlock('ones_vat_courses', oVat);

				oBlock = $('pricesSubCourseOnes_' + oVat['cost_id']);
			}

			oBlock.down('.pricesSubPositionTitle').innerHTML = oVat['title'];

			if(oVat['amount'] && oVat['amount'][$F('currency')])
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = oVat['amount'][$F('currency')]['formated'];

				if(oBlock.down('.pricesSubPositionVats'))
				{
					oBlock.down('.pricesSubPositionVats').innerHTML =
						oVat['amount'][$F('currency')]['tax_formated'] + ' (' + oVat['amount'][$F('currency')]['tax_rate_formated'] + '%)';
				}
			}
			else
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = '***';
				oBlock.down('.pricesSubPositionVats').innerHTML = '***';
			}
		});

		$('pricesBlockCourseContainerOnes').childElements().each(function(oChild)
		{
			if(!aUniques[oChild.id])
			{
				oChild.remove();
			}
		});
	}
	else if($('pricesBlockCourseContainerOnes'))
	{
		$('pricesBlockCourseContainerOnes').innerHTML = '';
	}

	if(mData['ones_vats'] && mData['ones_vats']['accommodations'].length > 0)
	{
		var aUniques = new Object();

		mData['ones_vats']['accommodations'].each(function(oVat)
		{
			var oBlock = $('pricesSubAccommodationOnes_' + oVat['cost_id']);

			aUniques['pricesSubAccommodationOnes_' + oVat['cost_id']] = true;

			if(!oBlock)
			{
				writePriceBlock('ones_vat_accommodations', oVat);

				oBlock = $('pricesSubAccommodationOnes_' + oVat['cost_id']);
			}

			oBlock.down('.pricesSubPositionTitle').innerHTML = oVat['title'];

			if(oVat['amount'] && oVat['amount'][$F('currency')])
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = oVat['amount'][$F('currency')]['formated'];

				if(oBlock.down('.pricesSubPositionVats'))
				{
					oBlock.down('.pricesSubPositionVats').innerHTML =
						oVat['amount'][$F('currency')]['tax_formated'] + ' (' + oVat['amount'][$F('currency')]['tax_rate_formated'] + '%)';
				}
			}
			else
			{
				oBlock.down('.pricesSubPositionPrice').innerHTML = '***';
				oBlock.down('.pricesSubPositionVats').innerHTML = '***';
			}
		});

		$('pricesBlockAccommodationContainerOnes').childElements().each(function(oChild)
		{
			if(!aUniques[oChild.id])
			{
				oChild.remove();
			}
		});
	}
	else if($('pricesBlockAccommodationContainerOnes'))
	{
		$('pricesBlockAccommodationContainerOnes').innerHTML = '';
	}

	$('totalPrice').innerHTML = mData['total'];
}

function writePriceBlock(sType, mData)
{
	switch(sType)
	{
		case 'courses':
		{
			var oCopy = $('pricesSubCourse').clone(true);

			oCopy.style.display = 'block';

			oCopy.id = 'p_c_' + mData['unique'];

			if($(oCopy.id))
			{
				$(oCopy.id).replace(oCopy);
			}
			else
			{
				$('pricesBlockCourseContainer').insert({bottom: oCopy});
			}

			oCopy = $('p_c_' + mData['unique']);

			oCopy.down('.pricesSubPositionTitle').innerHTML = mData['title'];

			oCopy.down('.pricesSubPositionDates').innerHTML = mData['dates'];

			oCopy.down('.pricesWeek').innerHTML = mData['weeks'];

			if(mData['prices'] && mData['prices']['add'])
			{
				mData['prices']['add'].each(function(oAdd)
				{
					var oSub = $('pricesSubAdd').clone(true);

					oSub.style.display = 'block';

					oSub.id = 'p_c_' + mData['unique'] + '_' + oAdd['cost_id'];

					oSub.down('.pricesSubPositionTitle').innerHTML = oAdd['title'];

					if($(oSub.id))
					{
						$(oSub.id).replace(oSub);
					}
					else
					{
						oCopy.down('.pricesSubCourseAdds').insert({bottom: oSub});
					}
				});
			}

			break;
		}
		case 'accommodations':
		{
			var oCopy = $('pricesSubAccommodation').clone(true);

			oCopy.style.display = 'block';

			oCopy.id = 'p_a_' + mData['unique'];

			if($(oCopy.id))
			{
				$(oCopy.id).replace(oCopy);
			}
			else
			{
				$('pricesBlockAccommodationContainer').insert({bottom: oCopy});
			}

			oCopy = $('p_a_' + mData['unique']);

			oCopy.down('.pricesSubPositionTitle').innerHTML = mData['title'];

			oCopy.down('.pricesSubPositionDates').innerHTML = mData['dates'];

			oCopy.down('.pricesWeek').innerHTML = mData['weeks'];

			if(mData['prices'] && mData['prices']['add'])
			{
				mData['prices']['add'].each(function(oAdd)
				{
					var oSub = $('pricesSubAdd').clone(true);

					oSub.style.display = 'block';

					oSub.id = 'p_a_' + mData['unique'] + '_' + oAdd['cost_id'];

					oSub.down('.pricesSubPositionTitle').innerHTML = oAdd['title'];

					if($(oSub.id))
					{
						$(oSub.id).replace(oSub);
					}
					else
					{
						oCopy.down('.pricesSubAccommodationAdds').insert({bottom: oSub});
					}
				});
			}

			break;
		}
		case 'vat':
		{
			var oCopy = $('pricesVat').clone(true);

			oCopy.style.display = 'block';

			oCopy.id = 'pricesVat_' + mData['rate'];

			if($(oCopy.id))
			{
				$(oCopy.id).replace(oCopy);
			}
			else
			{
				$('pricesVatsContainer').insert({bottom: oCopy});
			}

			break;
		}
		case 'ones_vat_courses':
		{
			var oCopy = $('pricesSubCourseOnes').clone(true);

			oCopy.style.display = 'block';

			oCopy.id = 'pricesSubCourseOnes_' + mData['cost_id'];

			if($(oCopy.id))
			{
				$(oCopy.id).replace(oCopy);
			}
			else
			{
				$('pricesBlockCourseContainerOnes').insert({bottom: oCopy});
			}

			break;
		}
		case 'ones_vat_accommodations':
		{
			var oCopy = $('pricesSubAccommodationOnes').clone(true);

			oCopy.style.display = 'block';

			oCopy.id = 'pricesSubAccommodationOnes_' + mData['cost_id'];

			if($(oCopy.id))
			{
				$(oCopy.id).replace(oCopy);
			}
			else
			{
				$('pricesBlockAccommodationContainerOnes').insert({bottom: oCopy});
			}

			break;
		}
	}
}

/* ==================================================================================================== */ // Loader

function showLoader()
{
	if(!$('ajaxLoaderLayer'))
	{
		return;
	}

	var aPageSize = $('pageDIV').getDimensions();

	var iBorderWidth =
		parseInt($('pageDIV').getStyle('border-left-width').replace(/px/, '')) + 
		parseInt($('pageDIV').getStyle('border-right-width').replace(/px/, ''));

	var iBorderHeight =
		parseInt($('pageDIV').getStyle('border-top-width').replace(/px/, '')) + 
		parseInt($('pageDIV').getStyle('border-bottom-width').replace(/px/, ''));

	$('ajaxLoaderLayer').style.width	= (aPageSize['width'] - iBorderWidth) + 'px';
	$('ajaxLoaderLayer').style.height	= (aPageSize['height'] - iBorderHeight) + 'px';

	var aImgSize = $('ajaxLoader').getDimensions();

	var iLeft	= parseInt((aPageSize['width'] - iBorderWidth - aImgSize['width']) / 2);
	var iTop	= parseInt((aPageSize['height'] - iBorderHeight - aImgSize['height']) / 2);

	$('ajaxLoader').style.left	= iLeft + 'px';
	$('ajaxLoader').style.top	= iTop + 'px';

	$('ajaxLoaderLayer').show();
}

function hideLoader()
{
	if($('ajaxLoaderLayer'))
	{
		$('ajaxLoaderLayer').hide();
	}
}

/* ==================================================================================================== */ // Print

function printPrices()
{
	if($('pricesBlockPrintCopy'))
	{
		$('pricesBlockPrintCopy').remove();
	}

	var oClone = $('pricesBlock').clone(true);

	oClone.id = 'pricesBlockPrintCopy';

	if(oClone.down('#pricesBlockCurrencies'))
	{
		oClone.down('#pricesBlockCurrencies').remove();
	}

	$('form').insert({before: oClone});

	window.print();
}

/* ==================================================================================================== */
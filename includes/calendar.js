//
// CalendarView (for Prototype)
//
// Copyright 2007-2008 Singlesnet, Inc.
// Copyright 2002-2005 Mihai Bazon
//
// Maintained by Justin Mecham <justin@corp.singlesnet.com>
//
// This calendar is based very loosely on the Dynarch Calendar in that it was
// used as a base, but completely gutted and more or less rewritten in place
// to use the Prototype JavaScript library.
//
// As such, CalendarView is licensed under the terms of the GNU Lesser General
// Public License (LGPL). More information on the Dynarch Calendar can be
// found at:
//
//   www.dynarch.com/projects/calendar
//

var Calendar = Class.create()

Calendar.VERSION = '1.1'

Calendar.DAY_NAMES = new Array(
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  'Sunday'
)

Calendar.ACTIVE_DAYS;

Calendar.FIRST_DAY;

Calendar.LAST_DAY;

Calendar.SHORT_DAY_NAMES = new Array(
  'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'
)

Calendar.MONTH_NAMES = new Array(
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
)

Calendar.SHORT_MONTH_NAMES = new Array(
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
  'Dec' 
)

Calendar.NAV_PREVIOUS_YEAR  = -2
Calendar.NAV_PREVIOUS_MONTH = -1
Calendar.NAV_TODAY          =  0
Calendar.NAV_NEXT_MONTH     =  1
Calendar.NAV_NEXT_YEAR      =  2
Calendar.TODAY				= 'Today';

//------------------------------------------------------------------------------
// Prpepare the output
//------------------------------------------------------------------------------

Calendar.prepare = function(aParams)
{
	Calendar.prepareCallback(oCalendarResponse, aParams);
}

Calendar.prepareCallback = function(oResponse, aParams)
{
	if(oResponse.responseText && oResponse.responseText != '')
	{
		var oData = oResponse.responseText.evalJSON();
	}
	else
	{
		var oData = oResponse;
	}

	var aData = oData;

	if(aData['sFirstDay']) {
		aData['sFirstDay']	= Date.parseDate(aData['sFirstDay'], aData['sFormat']);
	}
	if(aData['sLastDay']) {
		aData['sLastDay']	= Date.parseDate(aData['sLastDay'], aData['sFormat']);
	}

	Calendar.TODAY = aData['sToday'];

	Calendar.setup({
		dateField     	: aParams['dateField'],
		triggerElement	: aParams['triggerElement'],
		parentElement	: aParams['parentElement'],
		selectHandler	: eval(aParams['selectHandler']),
		closeHandler	: eval(aParams['closeHandler']),
		dateFormat		: aData['sFormat'],
		dayNames		: aData['aDays'],
		shortDayNames	: aData['aDaysShort'],
		monthNames		: aData['aMonths'],
		shortMonthNames	: aData['aMonthsShort'],
		today			: aData['sToday'],
		activeDays		: aData['aActiveDays'],
		firstDay		: aData['sFirstDay'],
		lastDay			: aData['sLastDay'],
		// External Closehandler
		extcloseHandler : aParams['extcloseHandler']
	});

}

//------------------------------------------------------------------------------
// Static Methods
//------------------------------------------------------------------------------

// This gets called when the user presses a mouse button anywhere in the
// document, if the calendar is shown. If the click was outside the open
// calendar this function closes it.
Calendar._checkCalendar = function(event) {
  if (!window._popupCalendar)
    return false
  if (Element.descendantOf(Event.element(event), window._popupCalendar.container))
    return
  window._popupCalendar.callCloseHandler()
  return Event.stop(event)
}

//------------------------------------------------------------------------------
// Event Handlers
//------------------------------------------------------------------------------

Calendar.handleMouseDownEvent = function(event)
{
  Event.observe(document, 'mouseup', Calendar.handleMouseUpEvent)
  Event.stop(event)
}

// XXX I am not happy with how clicks of different actions are handled. Need to
// clean this up!
Calendar.handleMouseUpEvent = function(event)
{
  var el        = Event.element(event)
  var calendar  = el.calendar
  var isNewDate = false

  // If the element that was clicked on does not have an associated Calendar
  // object, return as we have nothing to do.
  if (!calendar) return false

  // Clicked on a day
  if (typeof el.navAction == 'undefined')
  {

    if(el.hasClassName('inactive')) {
    	return false;
    }
	  
	if (calendar.currentDateElement) {
      Element.removeClassName(calendar.currentDateElement, 'selected')
      Element.addClassName(el, 'selected')
      calendar.shouldClose = (calendar.currentDateElement == el)
      if (!calendar.shouldClose) calendar.currentDateElement = el
    }
    calendar.date.setDateOnly(el.date)
    isNewDate = true
    calendar.shouldClose = !el.hasClassName('otherDay')
    var isOtherMonth     = !calendar.shouldClose
    if (isOtherMonth) calendar.update(calendar.date)
  }

  // Clicked on an action button
  else
  {
    var date = new Date(calendar.date)

    if (el.navAction == Calendar.NAV_TODAY) {
    	date.setDateOnly(new Date())
    }

    var year = date.getFullYear()
    var mon = date.getMonth()
    function setMonth(m) {
      var day = date.getDate()
      var max = date.getMonthDays(m)
      if (day > max) date.setDate(max)
      date.setMonth(m)
    }

    switch (el.navAction) {

      // Previous Year
      case Calendar.NAV_PREVIOUS_YEAR:
        if (year > calendar.minYear)
          date.setFullYear(year - 1)
        break

      // Previous Month
      case Calendar.NAV_PREVIOUS_MONTH:
        if (mon > 0) {
          setMonth(mon - 1)
        }
        else if (year-- > calendar.minYear) {
          date.setFullYear(year)
          setMonth(11)
        }
        break

      // Today
      case Calendar.NAV_TODAY:
        break

      // Next Month
      case Calendar.NAV_NEXT_MONTH:
        if (mon < 11) {
          setMonth(mon + 1)
        }
        else if (year < calendar.maxYear) {
          date.setFullYear(year + 1)
          setMonth(0)
        }
        break

      // Next Year
      case Calendar.NAV_NEXT_YEAR:
        if (year < calendar.maxYear)
          date.setFullYear(year + 1)
        break

    }

    dateFirst = new Date(date);
    dateFirst.setDate(1);
    dateLast = new Date(date);
    dateLast.setDate(dateLast.getMonthDays());

    if(
    	calendar.firstDay &&
    	dateLast.compare(calendar.firstDay) == -1
    ) {
    	return false;
    } else if(
    		calendar.lastDay &&
    	dateFirst.compare(calendar.lastDay) == 1
    ) {
    	return false;
    }    

    if (!date.equalsTo(calendar.date)) {
      calendar.setDate(date)
      isNewDate = true
    } else if (el.navAction == 0) {
      isNewDate = (calendar.shouldClose = true)
    }

  }

  if (isNewDate) event && calendar.callSelectHandler()

  Event.stopObserving(document, 'mouseup', Calendar.handleMouseUpEvent)

  return Event.stop(event)
}

Calendar.defaultSelectHandler = function(calendar)
{
  if (!calendar.dateField) return false

  // Update dateField value
  if (calendar.dateField.tagName == 'DIV')
    Element.update(calendar.dateField, calendar.date.print(calendar.dateFormat))
  else if (calendar.dateField.tagName == 'INPUT') {
    calendar.dateField.value = calendar.date.print(calendar.dateFormat) }
  // Trigger the onchange callback on the dateField, if one has been defined
  if (typeof calendar.dateField.onchange == 'function')
    calendar.dateField.onchange()

	// if Observ


  // Call the close handler, if necessary
  if (calendar.shouldClose) calendar.callCloseHandler()
}

Calendar.defaultCloseHandler = function(calendar)
{
  calendar.hide()
}


//------------------------------------------------------------------------------
// Calendar Setup
//------------------------------------------------------------------------------

Calendar.setup = function(params) {

  function param_default(name, def) {
    if (!params[name]) params[name] = def
  }

  param_default('dateField', null)
  param_default('triggerElement', null)
  param_default('parentElement', null)
  param_default('selectHandler',  null)
  param_default('closeHandler', null)
  param_default('extcloseHandler', null)
  
  // In-Page Calendar
  if (params.parentElement)
  {
    var calendar = new Calendar(params.parentElement, params)
    calendar.setSelectHandler(params.selectHandler || Calendar.defaultSelectHandler)
    if (params.dateFormat)
      calendar.setDateFormat(params.dateFormat)
    if (params.dateField) {
      calendar.setDateField(params.dateField)
      calendar.parseDate(calendar.dateField.innerHTML || calendar.dateField.value)
    }
    calendar.show()
    return calendar
  }

  // Popup Calendars
  //
  // XXX There is significant optimization to be had here by creating the
  // calendar and storing it on the page, but then you will have issues with
  // multiple calendars on the same page.
  else
  {
	  var triggerElement = $(params.triggerElement || params.dateField)
	  if(triggerElement){
		  triggerElement.onclick = function() {
			  var calendar = new Calendar(false, params)
			  calendar.setSelectHandler(params.selectHandler || Calendar.defaultSelectHandler)

			  calendar.setCloseHandler(params.closeHandler || Calendar.defaultCloseHandler)

			  calendar.setExtCloseHandler(params.extcloseHandler);

			  if (params.dateFormat)
				calendar.setDateFormat(params.dateFormat)
			  if (params.dateField) {
				calendar.setDateField(params.dateField)
				calendar.parseDate(calendar.dateField.innerHTML || calendar.dateField.value)
			  }
			  if (params.dateField)
				Date.parseDate(calendar.dateField.value || calendar.dateField.innerHTML, calendar.dateFormat)

			  var aOffset = calendar.dateField.cumulativeOffset();
			  var iHeight = calendar.dateField.getHeight();

			  calendar.showAtElement(calendar.dateField)
			  return calendar
		  }
	}
  }
}

//------------------------------------------------------------------------------
// Calendar Instance
//------------------------------------------------------------------------------

var sFormat = '%Y-%m-%d';

Calendar.prototype = {

  // The HTML Container Element
  container: null,

  // Callbacks
  selectHandler: null,
  closeHandler: null,

  // Configuration
  minYear: 1900,
  maxYear: 2100,
  dateFormat: sFormat,

  // Dates
  date: new Date(),
  currentDateElement: null,

  // Status
  shouldClose: false,
  isPopup: true,

  dateField: null,

  dayNames: null,
  shortDayNames: null,
  monthNames: null,
  shortMonthNames: null,
  today: null,
  activeDays: null,
  firstDay: null,
  lastDay: null,

  //----------------------------------------------------------------------------
  // Initialize
  //----------------------------------------------------------------------------

  initialize: function(parent, params)
  {
	this.setParams(params)
	if (parent)
      this.create($(parent))
    else
      this.create()
  },

  setParams: function(oParams) {

	  this.dayNames			= oParams['dayNames'];
	  this.shortDayNames	= oParams['shortDayNames'];
	  this.monthNames		= oParams['monthNames'];
	  this.shortMonthNames	= oParams['shortMonthNames'];
	  this.today			= oParams['today'];
	  this.activeDays		= oParams['activeDays'];
	  this.firstDay			= oParams['firstDay'];
	  this.lastDay 			= oParams['lastDay'];

  },
	  

  //----------------------------------------------------------------------------
  // Update / (Re)initialize Calendar
  //----------------------------------------------------------------------------

  update: function(date)
  {
    var calendar   = this
    var today      = new Date()
    var thisYear   = today.getFullYear()
    var thisMonth  = today.getMonth()
    var thisDay    = today.getDate()

    // Ensure date is within the defined range
    if (date.getFullYear() < this.minYear)
      date.setFullYear(this.minYear)
    else if (date.getFullYear() > this.maxYear)
      date.setFullYear(this.maxYear)

    if(
    	calendar.firstDay &&
    	date.compare(calendar.firstDay) == -1
    ) {
    	date = new Date(calendar.firstDay);
    } else if(
    	calendar.lastDay &&
   		date.compare(calendar.lastDay) == 1
    ) {
    	date = new Date(calendar.lastDay);
    }

    var month      = date.getMonth();
    var dayOfMonth = date.getDate();
    
    this.date = new Date(date)

    // Calculate the first day to display (including the previous month)
    date.setDate(1)
    date.setDate(-(date.getDay()) + 2)

    // Fill in the days of the month
    Element.getElementsBySelector(this.container, 'tbody tr').each(
    	function(row, i) {

    	var rowHasDays = false
        row.immediateDescendants().each(
          function(cell, j) {

        	var day            = date.getDate()
            var dayOfWeek      = date.getDay()
            var isCurrentMonth = (date.getMonth() == month)

            // Reset classes on the cell
            cell.className = ''
            cell.date = new Date(date)
            cell.update(day)

            // Account for days of the month other than the current month
            if (!isCurrentMonth)
              cell.addClassName('otherDay')
            else
              rowHasDays = true

            // Ensure the current day is selected
            if (isCurrentMonth && day == dayOfMonth) {
              cell.addClassName('selected')
              calendar.currentDateElement = cell
            }

            // Today
            if (date.getFullYear() == thisYear && date.getMonth() == thisMonth && day == thisDay)
              cell.addClassName('today')

            // Weekend
            if ([0, 6].indexOf(dayOfWeek) != -1)
              cell.addClassName('weekend')

            // Inactive day
            if(
            	calendar.activeDays.indexOf(dayOfWeek) == -1
            ) {
            	cell.addClassName('inactive');
            } else if(
            	calendar.firstDay &&
            	date.compare(calendar.firstDay) == -1
            ) {
            	cell.addClassName('inactive');
            } else if(
            	calendar.lastDay &&
           		date.compare(calendar.lastDay) == 1
            ) {
            	cell.addClassName('inactive');
            }

            // Set the date to tommorrow
            date.setDate(day + 1)
          }
        )
        // Hide the extra row if it contains only days from another month
        !rowHasDays ? row.hide() : row.show()
        
      }
    )

    if(this.container.getElementsBySelector('td.title')[0])
	{
		this.container.getElementsBySelector('td.title')[0].update(
			this.monthNames[month] + ' ' + this.date.getFullYear()
	    )
	}

  },



  //----------------------------------------------------------------------------
  // Create/Draw the Calendar HTML Elements
  //----------------------------------------------------------------------------

  create: function(parent)
  {

    // If no parent was specified, assume that we are creating a popup calendar.
    if (!parent) {
      parent = document.getElementById('thebing')
      this.isPopup = true
    } else {
      this.isPopup = false
    }

    // Calendar Table
    var table = new Element('table')

    // Calendar Header
    var thead = new Element('thead')
    table.appendChi
  }

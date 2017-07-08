

util.Controller.BaseAction.extend("util.Controller.Action", {
    this3: "",
    thisobj: {},
    onInit: function () {
        /*
            Modified:Guna
            Jira:LSSN-58804
            Action: Separated the i18n properties module wise 
        */
        // this.i18nmodel = sap.ui.getCore().getModel("i18n");
        util.i18nHelper.setLanguageBundle(this);

        // LSSN-22073 -- Fix for back button -- navigate back to the correct inbox or dashboard
        this.thisobj = this;

        var oView = this.getView();
        var bus = sap.ui.getCore().getEventBus();
        this.fromDashboard=false;

        oView.addEventDelegate({
            onBeforeShow: jQuery.proxy(function (evt) {
                this.onBeforeShow(evt);
            }, this)
        });
        oView.addEventDelegate({
            onAfterHide: jQuery.proxy(function (evt) {
                if (this.onAfterHide) {
                    this.onAfterHide(evt);
                }
            }, this)
        });

        if (this.onLoadFirstTime)
            this.onLoadFirstTime();

        // attach handlers for validation errors
        sap.ui.getCore().attachValidationError(function (evt) {
            var control = evt.getParameter("element");
            if (control && control.setValueState) {
                control.setValueState("Error");
            }
        });
        sap.ui.getCore().attachValidationSuccess(function (evt) {
            var control = evt.getParameter("element");
            if (control && control.setValueState) {
                control.setValueState("None");
            }
        });
		var that = this;
		this.focusEvt= { onfocusout : that.InputValueChangeValidation };
    },
    showSelector:function(inboxId, allowMultiple)
    {
          var multiple=allowMultiple || false;
    },
    back: function (evt) {
    	debugger;
        var that = this;
        if (this.data && this.data.navToactionID){
            var actionID=this.data.navToactionID;
            this.navToactionID=null;
            sap.ui.getCore().getEventBus().publish("nav", "to", { 
        //Helen - 10-05-2017
        //[LSSN-98690]
        //Issue:  Navigating back to action should not be stored
                writeHistory: false,
                id: actionID,
             data: {actionRetain: true}});
        }
        else if (that.data.actionConfig && that.data.actionConfig.mode === "viewOnly") {
						that.resetRequiredFields();
                        that.goBack();
					} else{
						sap.m.MessageBox.show(
                              that.i18nmodel.getProperty("util.Controller.Action.warning"),
                              sap.m.MessageBox.Icon.QUESTION,
                              that.i18nmodel.getProperty("view.Home.Confirmation"),
                              [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                              function (oAction) {
                                  if (oAction === sap.m.MessageBox.Action.YES) {
                                      that.resetRequiredFields();
                                      that.goBack();
                                  }
                              }
                          );
					}
        //srikanth LSSN-24263: for initializing scanning
        /*util.Common.isBarcodeScanned = null;
        util.Common.searchBarInstance = {};
        util.Common.currInbox = null;
        util.Common.currKpi = null;
        util.Common.scanningInbox = null;*/
        //end
    },
    
    goBack: function () {
        // LSSN-22073 -- Fix for back button -- navigate back to the correct inbox or dashboard
       if( util.ServiceConfig.ENV.isNative){
               
                util.nativeConfigLoader.commandComplete("goToAction", "success");
        }
       else if (typeof this.this3 != "undefined") {
            var id = typeof this.this3 == "undefined" ? this.thisobj.getView().getParent().getParent().getId() : this.this3;
            sap.ui.getCore().getEventBus().publish("nav", "to", { id: id, writeHistory: false });
        }
        else {      
            sap.ui.getCore().getEventBus().publish("nav", "to", { id: "InboxDashboard", writeHistory: false });
        }

    },

    onBeforeShow: function (evt) {
        try{

        var context = evt.data.context;
        var fromConfig=evt.data.config;
        this.data = evt.data;

        // LSSN-22073 -- Fix for back button -- navigate back to the correct inbox or dashboard
        this.this3 = evt.fromId;
        this.loadActionConfig(this.getValidObject(this.data,"actionConfig.target"));
        this.getView().addStyleClass("actionPage");

        if (evt.data.fromDashboard) {
            this.fromDashboard=true;
        } else {
            this.fromDashboard=false;
        }

        var modelLoaded=sap.ui.getCore().getModel("isModelLoaded");

        if (modelLoaded && modelLoaded==true)
        {
            //Already models are loaded
        }
        else {
            util.ServiceConfig.createODataModels();
        }

        //if (!context || context == null) return;//Ashik 01/09/2015; commented this line since we are not using default selection
        this.Context = context;
    }
    catch(e){
         console.log("evt.data.context is undefined.. hence causing navigational error... overriding it using a try and catch error method")
    }
        var from="";
        if (fromConfig)
            from=fromConfig.id;
        try {
            setTimeout(jQuery.proxy(function () {
                if (this.onLoad)
                    this.onLoad(this.Context,from,evt.data);
            }, this), 50);
        }
        catch (e) {
            throw new Error(this.i18nmodel.getProperty("util.Controller.Action.Error"));
        }
    },
    minDateEndDt :"",

    checkDate: function(oEvent) {
        var pattern = oEvent.getSource().getDisplayFormat() ? oEvent.getSource().getDisplayFormat() : "yyyy-MM-dd";
        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern:pattern });
        var today =  dateFormat.format(new Date());
        var selDate = dateFormat.format(new Date(oEvent.oSource.getDateValue()));
       
        if ((oEvent.getParameters().value !== "") && ( selDate < today)) {
            oEvent.oSource.setValue();
            oEvent.oSource._oCalendar.setPopupMode(true);
            var eDock = sap.ui.core.Popup.Dock;
            var sAt = eDock.BeginBottom + "-4";
            oEvent.oSource._oPopup.open(0, eDock.BeginTop, sAt, oEvent.getSource(), null, "fit", true);
            // sap.m.MessageToast.show(this.i18nmodel.getProperty("util.Controller.Action.DateWarning"), { duration: 8000, my: "center top", at: "center top", animationDuration: 8000, width: "20em" });
            oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
            oEvent.oSource.setValueStateText(this.i18nmodel.getProperty("util.Controller.Action.DateWarning"))
            return;
        }

        oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
        oEvent.oSource.setValueStateText("");

        this.minDateEndDt = oEvent.oSource.getDateValue();
        return selDate;

    },
   

   checkEndDatePast: function(oEvent) {
         var oCheck = oEvent.oSource;
          var bValid = oEvent.getParameter("valid");
          if (bValid) {
            oCheck.setValueState(sap.ui.core.ValueState.None);
            var pattern = oEvent.getSource().getDisplayFormat() ? oEvent.getSource().getDisplayFormat() : "yyyy-MM-dd";
            var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern:pattern });
            var selDate = dateFormat.format(new Date(oEvent.oSource.getDateValue()));
			/*  Allowing employee to enter From date and To date as same */	
            var minEdate = dateFormat.format(new Date(oEvent.getSource().data().minDateEndDt));
			/* Not allowing employee to enter From date and To date as same */
			var minSdate = dateFormat.format(new Date(oEvent.getSource().data().minDateSameDt));
			
            if ((oEvent.getParameters().value !== "") && (minEdate || minSdate) ) {          
                if ((selDate < minSdate) || (selDate <= minEdate)) {           
                    oEvent.oSource.setValue();
                    oEvent.oSource._oCalendar.setPopupMode(true);
                    var eDock = sap.ui.core.Popup.Dock;
                    var sAt = eDock.BeginBottom + "-4";
                    oEvent.oSource._oPopup.open(0, eDock.BeginTop, sAt, oEvent.getSource(), null, "fit", true);
                    sap.m.MessageToast.show(this.i18nmodel.getProperty("util.Controller.Action.EndDateWarning"), { duration: 8000, my: "center top", at: "center top", animationDuration: 8000, width: "20em" });
                }
            }
          } else {
                oEvent.oSource.setValue("");
          }
     this.maxDate=oEvent.oSource.getDateValue();
    },
   
    checkDateValidation: function (oEvent) {
        var oCheck = oEvent.oSource;
        var bValid = oEvent.getParameter("valid");
        if (bValid) {
            var selDate = new Date(oEvent.oSource.getDateValue());
            var minEdate = new Date(this.maxDate);
			var minSdate = oEvent.getSource().data().minDateSameENDDt;
            if ((oEvent.getParameters().value !== "") && this.maxDate) {
				/* If minDateSameENDDt is true Allowing employee to enter From date and To date as same(Not allowing in other actions) */
					if (minSdate ? (selDate > minEdate) : (selDate >= minEdate)) {
						oEvent.oSource.setValue();
						oEvent.oSource._oCalendar.setPopupMode(true);
						var eDock = sap.ui.core.Popup.Dock;
						var sAt = eDock.BeginBottom + "-4";
						oEvent.oSource._oPopup.open(0, eDock.BeginTop, sAt, oEvent.getSource(), null, "fit", true);
						sap.m.MessageToast.show(this.i18nmodel.getProperty("util.Controller.Action.StartDateWarning"), { duration: 8000, my: "center top", at: "center top", animationDuration: 8000, width: "20em" });
					}
				}        
			} else {
                oEvent.oSource.setValue("");
        }
      },
    checkEndDate: function (oEvent) {

        var pattern = oEvent.getSource().getDisplayFormat() ? oEvent.getSource().getDisplayFormat() : "yyyy-MM-dd";
        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern:pattern });
        var today =  dateFormat.format(new Date());
        var selDate = new Date(oEvent.oSource.getDateValue());
        var minEdate = this.minDateEndDt == "" ? new Date() : this.minDateEndDt;

        if ((oEvent.getParameters().value !== "") && (selDate < today)) {
            oEvent.oSource.setValue();
            oEvent.oSource._oCalendar.setPopupMode(true);
            var eDock = sap.ui.core.Popup.Dock;
            var sAt = eDock.BeginBottom + "-4";
            oEvent.oSource._oPopup.open(0, eDock.BeginTop, sAt, oEvent.getSource(), null, "fit", true);
            sap.m.MessageToast.show(this.i18nmodel.getProperty("util.Controller.Action.DateWarning"), { duration: 8000, my: "center top", at: "center top", animationDuration: 8000 ,width: "20em"});

        }
        if ((oEvent.getParameters().value !== "") && minEdate) {           
            if (selDate < minEdate) {
                oEvent.oSource.setValue();
                oEvent.oSource._oCalendar.setPopupMode(true);
                var eDock = sap.ui.core.Popup.Dock;
                var sAt = eDock.BeginBottom + "-4";
                oEvent.oSource._oPopup.open(0, eDock.BeginTop, sAt, oEvent.getSource(), null, "fit", true);
                sap.m.MessageToast.show(this.i18nmodel.getProperty("util.Controller.Action.EndDateWarning"), { duration: 8000, my: "center top", at: "center top", animationDuration: 8000, width: "20em" });
            }
        }
    },

    ValidateDateRange: function (oEvent) {
        var startDate;
        var endDate;

        // Once we click on Start date
        if (oEvent.getSource().data().startDateID) {
            startDateID = oEvent.getSource().data("startDateID");
            startDate = this.getView().byId(startDateID).getValue();
        } else
            startDate = oEvent.getSource().getValue();

        // Once we click on End date
        if ((oEvent.getSource().data().endDateID)) {
            endDateID = oEvent.getSource().data("endDateID");
            endDate = this.getView().byId(endDateID).getValue();
        } else
            endDate = oEvent.getSource().getValue();

        if (moment(startDate).diff(endDate, "days") > 0 || moment(new Date()).diff(startDate, "days") > 0) {
            oEvent.oSource.setValue();
            //added to make valuestate none after the selection
            //LSSN-23474 Quote Agreements Inbox
            //LSSN-45304 error message material not found(parent)
            oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
            oEvent.oSource._oCalendar.setPopupMode(true);
            var eDock = sap.ui.core.Popup.Dock;
            var sAt = eDock.BeginBottom + "-4";
            oEvent.oSource._oPopup.open(0, eDock.BeginTop, sAt, oEvent.getSource(), null, "fit", true);

            //Author: Chandra Sekhar S
            //Reason: LSSN-42573
            //Change made: Displayed messagebox instead of message toast
            sap.m.MessageBox.show(this.i18Model.getText("view.Action.DateRangeValidatorMessage"),
            sap.m.MessageBox.Icon.WARNING,
            this.data.config.title,
            [sap.m.MessageBox.Action.OK]);
        }
        //added to make valuestate none after the selection
        //LSSN-23474 Quote Agreements Inbox
        //LSSN-45304 error message material not found(parent)
        else{
        	oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
        }
    },

    validatePicker: function(evt) {
		var that = this;
        var targetInbox = util.Config[evt.getSource().data("inboxId")];
        var url = util.ServiceConfig.getHanaHostName(targetInbox.domain) + targetInbox.master.service;
        var path = path = util.ParamHelper.replaceProfileParams(targetInbox.master.bindPath);
        var countQuery = "/$count?";
        path = path + countQuery;
        var urlValue = url + path + "&$filter=" + evt.getSource().data("fieldId") + " eq " + "'" + evt.getSource().getValue() + "'";
        var hanaUserData = sap.ui.getCore().getModel("hanaUserData")
        $.ajax({
            url: urlValue,
            dataType: 'json',
            username: hanaUserData.username,
            password: hanaUserData.password,
            async: false,
            headers: {'Accept-Language': sap.ui.getCore().getConfiguration().getLanguage()},
            xhrFields: {
                withCredentials: false
            },
            success: function(data) {
                if (parseInt(data) <= 0) {
                    sap.m.MessageToast.show(that.i18nmodel.getProperty("util.Controller.Action.InvalidEntry"));
                    evt.getSource().setValueState(sap.ui.core.ValueState.Error);
                    evt.getSource().setValueStateText(that.i18nmodel.getProperty("util.Controller.Action.InvalidEntry"));                    
                }
                else
                    evt.getSource().setValueState(sap.ui.core.ValueState.Success);                
            }
        });

    },
    gotoMaster: function (result) {

        if (util.ServiceConfig.ENV.isNative) {

            util.nativeConfigLoader.commandComplete("goToAction", "success");
        }
        else {
            var that = this;
            var prm = new Promise(function (resolve, reject) {
                util.Common.checkMaterializationCall.call(util.Config[that.data.cInboxId], resolve, reject);
            });
            prm.then(function (data) {

                util.ActionTrackerHelper.followAction(that, "Action");
                var bus = sap.ui.getCore().getEventBus();
                //Guna, LSSN-70626, Changing the writeHistory to true.
                bus.publish("nav", "to", { id: that.data.cInboxId, writeHistory: true });
                bus.publish("inbox", "refresh",
				    {
				        id: that.data.cInboxId,
				        data: {
				            fromAction: true,
				            filters: [],
				            sort: that.data.sorter,
				            config: util.Config[that.data.cInboxId]
				        }
				    }
				);

            });

        }
    },
    gotoMasterApplyFilter: function (result, writeHistoryFlag) {
        if (util.ServiceConfig.ENV.isNative) {

            util.nativeConfigLoader.commandComplete("goToAction", "success");
        }
        else {
            util.ActionTrackerHelper.followAction(this, "Action");
            var that = result
            var bus = sap.ui.getCore().getEventBus();
            bus.publish("nav", "to", { id: that.data.cInboxId, writeHistory: writeHistoryFlag });
            bus.publish("inbox", "refresh",
                {
                    id: that.data.cInboxId,
                    data: {
                        fromAction: true,
                        filters: that.data.filter,
                        sort: that.data.sorter,
                        config: util.Config[that.data.cInboxId],
                        navToactionID: that.data.navToactionID
                    }
                }
            );
        }
    },
    resetRequiredFields: function () {
        var v = this.getView();
        $.each(v.findElements('Input'), function (i, ele) {
            if (ele instanceof sap.m.Input) {
                if (ele.data().required == "true") {
                    ele.setValueState("None");                    
                }
            }
        });
		$.each(v.findElements('DateTimeInput'), function (i, ele) {
            if (ele instanceof sap.m.DateTimeInput) {
                if (ele.data().required == "true") {
                    ele.setValueState("None");                    
                }
            }
        });		
		$.each(v.findElements('DatePicker'), function (i, ele) {
            if (ele instanceof sap.m.DatePicker) {
                if (ele.data().required == "true") {
                    ele.setValueState("None");                    
                }
            }
        });		
		$.each(v.findElements('TextArea'), function (i, ele) {
            if (ele instanceof sap.m.TextArea) {
                if (ele.data().required == "true") {
                    ele.setValueState("None");                    
                }
            }
        });
    },
    resetInputs: function () {
        var v = this.getView();
        $.each(v.findElements('Input'), function (i, ele) {
            if (ele instanceof sap.m.Input) {
                if (ele.data().required == "true") {
                    ele.setValueState("Error");
                    ele.setValueStateText("Enter " + ele.getPlaceholder());
                    ele.setTooltip("Enter " + ele.getPlaceholder());
                }
            }
        });
    },
         
    validateInputValues: function(pr,panelToValidate) { 
        var that = this;
        var v = this.getView();
        if(panelToValidate){v = this.getView().byId(panelToValidate);}
        var canContinue = true;
        var requiredGroups={};
        that.validationcheck={};
        $.each(v.findElements('Input'), function (i, ele) {
            if (ele instanceof sap.m.MultiInput){
                if ((ele.data().required == "true" || ele.data().required == true) && (ele.getTokens().length===0)) {
                ele.setValueState("Error");
                /**
				 *Invalid entry value state change
				 */
				ele.setShowValueStateMessage(false);
                that.errorStr.push(ele.data().fieldName||ele.getPlaceholder());//fieldName used if placeholder is not meaningful to show in the message
                canContinue=false
                }
        }
         else if (ele instanceof sap.m.InputBase || ele instanceof sap.m.Input || ele instanceof sap.m.DatePicker || ele instanceof sap.m.DateTimeInput || ele instanceof sap.m.TextArea || ele instanceof sap.m.TimePicker) {
               

               if(panelToValidate){ // Added by ashik, for checking proper rquired check , if required flag is boolean or string  as true.
                                    // but some scenarios it is failing in aother action, once we verified we can remove else and make it common 

                        if (!ele.data().requiredGroup) {
                       if ((ele.data().required == "true" || ele.data().required == true) && !ele.getValue()) {
                       	ele.setValueState("Error");
						/**
						 *Invalid entry value state change
						 */
						ele.setShowValueStateMessage(false);
                        that.errorStr.push(ele.data().fieldName||ele.getPlaceholder());//fieldName used if placeholder is not meaningful to show in the message
                        canContinue=false
                        }
                        else if ((ele.data().validationRequired == "true" || ele.data().validationRequired == true) && ele.getValueState() == "Error") {
                        //Nitesh - 13-06-2017
                        //[LSSN-67127]
                        //Issue:  Extra lines are getting added 
                        //Action: removed line change while pushing error text
                        that.errorStr.push(ele.getValueStateText());
                        canContinue = false
                        }else{
                        ele.setValueState("Success");
                        }
                        }
                        else{ // else is handling rquired group
                        ele.setValueState("Success");
                        var valueEl=(ele.getValue())?ele:false
                        if(requiredGroups[ele.data().requiredGroup])
                        {
                        requiredGroups[ele.data().requiredGroup].elms.push(ele);
                        if(!requiredGroups[ele.data().requiredGroup].valueEl)
                        requiredGroups[ele.data().requiredGroup].valueEl=valueEl;

                        }
                        else
                        {
                        requiredGroups[ele.data().requiredGroup]={elms:[ele],valueEl:valueEl};

                        }
                        }



               }

               else{
                if (!ele.data().requiredGroup) {
	                if (ele.data().required == "true"  && !ele.getValue()) {
	                    ele.setValueState("Error");
                        ele.setShowValueStateMessage(false);
	                    that.errorStr.push(ele.data().fieldName||ele.getPlaceholder());//fieldName used if placeholder is not meaningful to show in the message
	                    canContinue=false;
	                    that.validationcheck['required']=ele.data().required;
	                }
	            	else if (ele.data().validationRequired == "true"  && ele.getValueState() == "Error") {
	                    //that.errorStr.push("\n"+ele.getValueStateText()+"\n");
                        //Nitesh - 09-06-2017
                        //[LSSN-67127]
                        //Issue:  Extra lines are getting added 
                        //Action: removed line change while pushing error text
                        that.errorStr.push(ele.getValueStateText());
	                    canContinue = false;
	                    that.validationcheck['validationRequired']=ele.data().validationRequired;
	                 }else{
                    	ele.setValueState("Success");
	                 }
                }
                else{ // else is handling rquired group
                        ele.setValueState("Success");
                        var valueEl=(ele.getValue())?ele:false
                        if(requiredGroups[ele.data().requiredGroup])
                       {
                         requiredGroups[ele.data().requiredGroup].elms.push(ele);
                         if(!requiredGroups[ele.data().requiredGroup].valueEl)
                            requiredGroups[ele.data().requiredGroup].valueEl=valueEl;

                       }
                       else
                       {
                        requiredGroups[ele.data().requiredGroup]={elms:[ele],valueEl:valueEl};

                       }
                }
            } // end of else added by ashik 

                //else if (ele.data().required == "true" && ele.getValue()) {
                //    ele.setValueState("Success");
                //}
            }
        });


                    // follwing code for validate grouping field separately
                    $.each(requiredGroups,function(key,obj){
                       
                    if(!obj.valueEl)
                    { var errorStr=[];
                    $.each(obj.elms,function(key,el){
                    el.setValueState("Error");
                    el.setShowValueStateMessage(false);
                    //errorStr.push(el.data().valMsg);
                    if(errorStr.indexOf(el.data().valMsg)===-1){
                        errorStr.push(el.data().valMsg);  
                        }
                    canContinue=false;
                    });
                     that.errorStr.push(errorStr.join(' or '));
                    }
                    else
                    {   var temHldr=obj.valueEl.getValue();
                        obj.valueEl.setValue("");
                        obj.valueEl.setValue(temHldr);
                        if (obj.valueEl.fireLiveChange)
                        obj.valueEl.fireLiveChange();
                        if(obj.valueEl.getValueState()=="Error"){
                         that.errorStr.push(obj.valueEl.getValueStateText());   
                          canContinue=false;
                        }

                    }

                    $.each(obj.elms, function (key, el) {
                       

                        if (el.getValue() && el.getId()!= obj.valueEl.getId()) {
                            var temHldr = el.getValue();
                            el.setValue("");
                            el.setValue(temHldr);
                            if (el.fireLiveChange)
                            el.fireLiveChange();

                            if (el.getValueState() == "Error") {
                                that.errorStr.push(el.getValueStateText());
                                canContinue = false;
                            }

                        }

                    });


                    })



        return canContinue;
    },
	
	
		 MaxDat: function() { 
				 
				var that = this;
				var v = this.getView();
				var canContinue = true;
				$.each(v.findElements('Input'), function (i, ele) {
					
					if (ele instanceof sap.m.DatePicker) {
						if (ele.data().reset == "true") {
							if(ele._oCalendar){
							ele._oCalendar._oFocusedDate.oDate = new Date()
							ele.setValue("");
							canContinue=false
							}
							else{
								return;
							}
						}
					}
				});
				//return canContinue;
			},
    typeEMail: sap.ui.model.SimpleType.extend("email", {
        formatValue: function (oValue) {
            return oValue;
        },
        parseValue: function (oValue) {
            //parsing step takes place before validating step, value can be altered
            return oValue;
        },
        validateValue: function (oValue) {
            /* Bugfix - LSSN-28731 */
           // var mailregex = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
           // var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
           /* Regex Changed for Performance */
           var mailregex = /^[a-zA-Z0-9'._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!oValue.match(mailregex)) {
                throw new sap.ui.model.ValidateException("is not a valid email address");
            }
        }
    }),

    getDescription: function (id, picker, cf, df, extFilter) {
        
        var desc;
        // Ashik : added picket check 23/03/26
        if (picker){
       

        if (!this.loadedPickers) {
            this.loadedPickers = [];
        }
        var result = $.grep(this.loadedPickers, function (e) { return e.code == id+"_"+picker; });

        if (result.length == 0 && id) {


            var k = { code: id+"_"+picker, desc: "" };
            this.loadedPickers.push(k);
            var ib = util.Config[picker];
            var hu = sap.ui.getCore().getModel("hanaUserData");
            var sUrl = util.ServiceConfig.getHanaHostName(ib.domain) + ib.master.service;
            var bpath = util.ParamHelper.replaceProfileParams(ib.master.bindPath);
            var pFilters="";
             if (ib.profileFilter) {
                var pFilters = util.ParamHelper.buildFilters(ib.profileFilter);
                pFilters = util.ParamHelper.modifyFiltersWithContext(pFilters, null);
                pFilters= " and "+util.ParseModelFilterToString.getFilterToString(pFilters);
             }
            // will do in generic way later, ashik,24/feb/2015
                
                    extFilter = (extFilter)?' and '+ extFilter:"";

                    var fltr = "?$filter=" + "(" + cf + " eq '" + id + "' )" + pFilters + extFilter;
            $.ajax({

                url: sUrl+bpath+fltr,
                dataType: 'json',
                async: false,
                contentType: "application/json",
                headers: {'Accept-Language': sap.ui.getCore().getConfiguration().getLanguage()},
                type: "GET",
                data: {},
                username: hu.username,
                password: hu.password,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function () {
                },
                success: function (data) {
                    if (data.d.results.length) {
                        var b = data.d.results[0];
                        k.desc = b[df];
                    }
                },
                error: function (error) {
                }
            });            
        }

        result = $.grep(this.loadedPickers, function (e) { return e.code == id+"_"+picker; });
        if (!desc && result.length>0) {
            desc = result[0].desc
        }
        }
        return desc;
    },

    trimTrailingZeros: function(field) {
        var re = /^(-)?0+(?=\d)/;
        return field.toString().replace(re, '$1');
    },
    trimLeadingZeros: function (field) {
       
        return parseFloat(field);
    },
    typeTele: sap.ui.model.SimpleType.extend("tele", {
        formatValue: function (oValue) {
            return oValue;
        },
        parseValue: function (oValue) {
            //parsing step takes place before validating step, value can be altered
            return oValue;
        },
        validateValue: function (oValue) {
            var mailregex = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
            if (!oValue.match(mailregex)) {
                throw new sap.ui.model.ValidateException(this.i18nmodel.getProperty("util.Controller.Action.InvalidTeleEntry"));
            }
        }
    }),
    panelHeaderItem: function(f1,f2) {
        var re = /^(-)?0+(?=\d)/;
        return f1.replace(re, '$1') + " | " + f2;
    },
    requiredField: sap.ui.model.SimpleType.extend("requiredField", {
        formatValue: function (oValue) {
            return oValue;
        },
        parseValue: function (oValue) {
            //parsing step takes place before validating step, value can be altered
            return oValue;
        },
        validateValue: function (oValue) {
            
            if (oValue.length<=0) {
            	throw new sap.ui.model.ValidateException(sap.ui.getCore().getModel("i18n").getProperty("util.Controller.Action.InvalidTeleEntry"));
            }
        }
    }),

    //Gets the value from the resource file
    getResourceData: function (resourceKey) {
        return sap.ui.getCore().getModel("i18n").getProperty(resourceKey);
    },
    metaDataToObject: function (data) {
        var that = this;
        $.each(data, function (key, datObj) {
            if (key == "RETURN") {
                delete (data[key]);
            }
            if (typeof (data[key]) == 'object') {
                if (data[key].hasOwnProperty("DESCRIPTION") && data[key].DESCRIPTION == null) {
                    data[key].DESCRIPTION = "";
                }
                prevObj = data;
                prevKey = key;
                that.metaDataToObject(data[key]);
            }
            if (typeof (data.TYPE) != 'undefined') {
                var strip = true;
                $.each(data, function (k, d) {
                    if (typeof (data[k]) == "object") {
                        strip = false;
                        return false;
                    }
                });

                if (strip) {
                    // eval('prevObj.' + eval('prevKey') + '=""');
                    eval('prevObj["' + eval('prevKey') + '"]=""');
                    return false;
                } else {
                    $.each(data, function (k, d) {
                        if (typeof (data[k]) != "object"&& ["PARTN_ROLE"].indexOf(k)<0) {
                            delete data[k];
                        }
                    });
                }
            }
        });
    },
    metaDataTableToArray: function (data, bapiName) {
        if (data[bapiName].TABLES) {

            for (var i in data[bapiName].TABLES) {
                var temp = jQuery.extend(true, {}, data[bapiName].TABLES[i]);
                if (temp.hasOwnProperty("OPTIONAL"))
                    delete temp.OPTIONAL;

                data[bapiName].TABLES[i] = [];
                data[bapiName].TABLES[i].push(temp);
            }
        }
    },
    getDateTime: function(d,t) {
        return d + " " + t;
    },

    error: function (statuscode) {
        var that = this;
        var errorMsg = "";
        switch (statuscode) {
            case 0:
                errorMsg = that.i18nmodel.getProperty("util.Controller.Action.serverLost");
                break;
            default:

        }
        sap.m.MessageBox.show(
                              errorMsg + that.i18nmodel.getProperty("util.Controller.Action.tryAgain"),
                              sap.m.MessageBox.Icon.QUESTION,
                              "Alert",
                              [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                              function (oAction) {
                                  if (oAction === sap.m.MessageBox.Action.YES) {
                                      that.resetRequiredFields();
                                      that.goBack();
                                  }
                              }
                          );
    },
    getFieldsDescription: function (mdlName, ctrler) {
        jQuery.sap.require("view.Inbox.ActionServices");
        //util.Config[picker]
        var hu = sap.ui.getCore().getModel("hanaUserData");
        var descCalls = [];
        var model = ctrler.getView().getModel(mdlName);
        $.each(model.oData, function (key, obj) {

            if (typeof (obj) == 'object' && obj.asyncCall) {

                var pickerName = key,
                 ib = util.Config[obj.inbox],
                 cf = obj.codeField,
                 listField = obj.listField,
                 descfieldName = obj.descField,
                 fieldValue = obj.value,
                 bProperty = obj.bProperty,
                 bindModelName = obj.bindModelName,
                 validcase = false,
                 extFilter = (obj.ctxtFilter)?obj.ctxtFilter:"";

                var sUrl = util.ServiceConfig.getHanaHostName(ib.domain) + ib.master.service;
                var bpath = util.ParamHelper.replaceProfileParams(ib.master.bindPath);
                var pFilters = "";

                if (ib.profileFilter) {
                    var pFilters = util.ParamHelper.buildFilters(ib.profileFilter);
                    pFilters = util.ParamHelper.modifyFiltersWithContext(pFilters, null);
                    pFilters = " and " + util.ParseModelFilterToString.getFilterToString(pFilters);
                }

                extFilter = (extFilter) ? ' and ' + util.ParseModelFilterToString.getFilterToString([extFilter]) : "";

                if (obj.isList) {
                    var ctxtFilter = [],
                        dupCheck = {};

                    $.each(obj.listObject, function (key, objc) {
                        validcase = true;
                        ctxtFilter.push(new sap.ui.model.Filter(cf, sap.ui.model.FilterOperator.EQ, objc[listField]));
                    });

                    var fltr, filters = [];

                    if (ctxtFilter.length == 1)
                        fltr = filters.concat(ctxtFilter[0]);
                    else
                        fltr = filters.concat(new sap.ui.model.Filter(ctxtFilter, false));

                    var filterString = util.ParseModelFilterToString.getFilterToString(fltr);
                    fltr = filterString.replace("%27datetime%2720141109%27%27", "datetime%2720141109%27");
                    fltr = "?$filter=" + "(" + fltr + " )" + pFilters + extFilter;
                    var callBack = function (data) {
                        var uomObj = {};
                        $.each(data.d.results, function (i, sObj) {
                            uomObj["key" + sObj[cf]] = sObj[descfieldName];
                        })
                        $.each(obj.listObject, function (i, sObj) {
                            var kb = "key" + sObj[listField];
                            sObj[bProperty] = uomObj[kb];

                        })

                        var m = ctrler.getView().getModel(bindModelName);
                        m.setData(m.getData());
                        m.refresh();
                    }


                }
                else {
                    validcase = true;
                    var fltr = "?$filter=" + "(" + cf + " eq '" + fieldValue + "' )" + pFilters + extFilter;
                    var callBack = function (data) {
                        // var dummy = 123;
                       // alert("needed coding here");
                        if(data.d.results.length){
                        model.getData()[pickerName][bProperty] = data.d.results[0][descfieldName];
                        model.setData(model.getData());
                        model.refresh();
                        }

                    }

                }

                if (validcase) {
                    url = sUrl + bpath + fltr;
                    descCalls.push({
                        url: url,
                        success: callBack,
                        isHana: true
                    });
                }
            }
        })

        var hanaCallback = function (that) {
            sap.ui.core.BusyIndicator.hide();
        }
        if (descCalls.length)
            view.Inbox.ActionServices.fireAllHanafetch(descCalls, hanaCallback, ctrler);
    },
    hanaCallback: function (that) {
        sap.ui.core.BusyIndicator.hide();
    },
    createProductBindPath: function (c,salesOrg, distiChannel) {

        c.master.bindPath = c.master.bindPath + "(P_SAPClient='{SAPClient}',P_SalesOrg='" + salesOrg + "',P_DistrChan='" + distiChannel + "')/Results";

    },
    setTelformat: function (c, o,mn) {
        var modelPcker = this.getView().getModel(mn);
        var modelPckerData = modelPcker.getData();
        // that.getLanguage(data.Langauge);
        if (c == "IN") {
            modelPckerData.telPlaceHolder = 'XXX XXX XXXX';
        }
        else {
            modelPckerData.telPlaceHolder = this.i18Model.getText("view.Inbox.Sales.FieldSales.Contact.Actions.Create.TelephoneNumber");
        }
        modelPcker.refresh();
    },
    
    //author Aruna Sri
    //Used for Teat Area validations(not for pickers)
    validateTextArea:function(evt){
  	  if (evt.getSource().getValue() === "") {
            evt.getSource().setValueState(sap.ui.core.ValueState.Error);  // if the field is empty after change, it will go red
      }
      else {
            evt.getSource().setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
      }
    },
    
    reqValidate:function(evt){
        if(evt.getSource().getValue())
            evt.getSource().setValueState("None");
             
     },

	 
	 AttachValueChange: function(formId){
		var that = this;
        var v = this.getView();
        if(formId){v = this.getView().byId(formId);}
        $.each(v.findElements('Input'), function (i, ele) {
			if (ele instanceof sap.m.Input || ele instanceof sap.m.TextArea){
				ele.detachLiveChange(that.InputValueChangeValidation);
				ele.attachLiveChange(that.InputValueChangeValidation);
				ele.removeEventDelegate(that.focusEvt);
				ele.addEventDelegate(that.focusEvt);
				ele.setValueState("None");
				ele.setShowValueStateMessage(false);
			}
			else if (ele instanceof sap.m.MultiInput || ele instanceof sap.m.DatePicker
						|| ele instanceof sap.m.DateTimeInput || ele instanceof sap.m.TimePicker){
				ele.detachChange(that.InputValueChangeValidation);
				ele.attachChange(that.InputValueChangeValidation);
				ele.removeEventDelegate(that.focusEvt);
				ele.addEventDelegate(that.focusEvt);
				ele.setValueState("None");
				ele.setShowValueStateMessage(false);
			}
			
		});
        
	},
	
	InputValueChangeValidation: function(evt) {
			if(evt.currentTarget){var ele = sap.ui.getCore().byId(evt.currentTarget.id);}
			else{var ele = evt.getSource();}
			
            if (ele instanceof sap.m.MultiInput){
                if ((ele.data().required == "true" || ele.data().required == true) && (ele.getTokens().length===0)) {
					ele.setValueState("Error");
                }
				else{
					ele.setValueState("None");
				}
			}
			else if (ele instanceof sap.m.Input || ele instanceof sap.m.DatePicker
						|| ele instanceof sap.m.DateTimeInput || ele instanceof sap.m.TextArea 
						|| ele instanceof sap.m.TimePicker) 
			{
				if ((ele.data().required == "true" || ele.data().required == true) && !(ele.getValue())) {
					ele.setValueState("Error");
                }
				else{
					ele.setValueState("None");
				}
			}
        
	},
	
	resetAllValueState: function () {
        var v = this.getView();
        $.each(v.findElements('Input'), function (i, ele) {
            if (ele instanceof sap.m.Input || ele instanceof sap.m.DateTimeInput
					|| ele instanceof sap.m.DatePicker || ele instanceof sap.m.TextArea
					|| ele instanceof sap.m.MultiInput) {
                ele.setValueState("None");  
            }
        });
    },

     tagIrToActivities:function(data,actionName){
         //window.intRecGUID='0050568228131ED68E8D24EA196E7C14'; // IR ID= 300017222
             if(window.intRecGUID){
                 if(!data.INPUT){data.INPUT={IV_IR_GUID:""};}
                 data.INPUT.IV_IR_GUID=window.intRecGUID;
             }

     },
    isValidEmail:function(email){
		if(!email)
		return false;

	    var mailregex = /^[a-zA-Z0-9'._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        
        if (!email.match(mailregex))
        return false; 
        else
        return true; 
          

    },
    setCountForActionTabs:function(tab,data){
        var that = this;
        var tabs=tab.getItems();
        if(!tab.hasStyleClass("customeCountClass")){
          tab.addStyleClass("customeCountClass");
        }
            tabs.forEach(function(tab,i){
                if(data[i]!=="N/A" && data[i]!=="I"){
                tab.setCount(data[i]);
               }else if(data[i]=="I"){
                 tab.setCount(".");
               }else{
                tab.setCount("");
               }
            });
    
  }
});
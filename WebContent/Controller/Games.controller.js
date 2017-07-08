jQuery.sap.require("com.test.Generic.Common");

sap.ui.controller("com.test.Controller.Games", {


	
	
	onInit : function (evt) {
		
			},
	
	onPressStudentDetailsBack: function(){
		jQuery.sap.require("com.test.Generic.Common");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("overview");
	}

	
	/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf View.StudentSessions
*/
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf View.StudentSessions
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf View.StudentSessions
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf View.StudentSessions
*/
//	onExit: function() {
//
//	}

});
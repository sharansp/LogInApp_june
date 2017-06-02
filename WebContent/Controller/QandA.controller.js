sap.ui.controller("com.test.Controller.QandA", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf View.QandA
*/
	onInit: function() {
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("Questions").attachPatternMatched(this._onObjectMatched, this);
	},
	_onObjectMatched: function(oEvent){
		var that=this;
		var val = oEvent.mParameters.arguments.key;
		var model=sap.ui.getCore().getModel();
		var modelData=model.getData();
	},
	handleBackButton: function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("StudentSessions");
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf View.QandA
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf View.QandA
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf View.QandA
*/
//	onExit: function() {
//
//	}

});
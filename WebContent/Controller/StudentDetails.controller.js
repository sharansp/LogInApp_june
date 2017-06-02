sap.ui.controller("com.test.Controller.StudentDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf View.StudentDetails
*/
	onInit: function() {
		var model = new sap.ui.model.json.JSONModel({Panel:false,EditField:false,SaveButton:false,EditButton:true });
        this.getView().setModel(model, "editModel");
	},
	
	onPressEdit: function(){
		var model=this.getView().getModel('editModel');
		var modelData=model.getData();
		
		modelData.Panel=true;
		modelData.EditField=true;
		modelData.SaveButton=true;
		modelData.EditButton=false;
		model.refresh();
		//this.byId('basicDetailsPanel').expanded=true;
	},
	
	handleSavePress: function(evt){
		var model=this.getView().getModel('editModel');
		var modelData=model.getData();
		
		modelData.Panel=false;
		modelData.EditField=false;
		modelData.SaveButton=false;
		modelData.EditButton=true;
		model.refresh();
	},
	
	onPressStudentDetailsBack: function(evt){
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("");
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf View.StudentDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf View.StudentDetails
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf View.StudentDetails
*/
//	onExit: function() {
//
//	}

});
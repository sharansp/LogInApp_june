sap.ui.controller("com.test.Controller.StudentSessions", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf View.StudentSessions
*/
	onInit: function() {
		var oModel = new sap.ui.model.json.JSONModel( );
		this.getView().setModel(oModel);
		oModel.refresh();
		
		
		var that = this;
		//oModel.loadData("json/test.json");
		oModel.setData(oModel.loadData("json/test.json"),"model");
		//sap.ui.getCore().setModel(oModel.loadData("json/test.json"),"Jmodel");
		debugger;
		oModel.attachRequestCompleted(function(){
			console.log(oModel.getData());
			that.getView().setModel(oModel);
			sap.ui.getCore().setModel(oModel);
			 var id1=that.getView().byId('idListCourse');
			id1.setSelectedItem(id1.getItems()[0]);
			var view=that.getView().byId('detail').getController();
			view._onObjectMatched();
			oModel.refresh();
		});
		
		
		
        var id=this.getView().byId('idListCourse');
        
		 var oItemSelectTemplate = new sap.m.StandardListItem({
		               
		               title: "{Concept}",
		               key:"{key}",
		               type : sap.m.ListType.Navigation
		              
		           });

		           id.setModel(oModel);
		           id.bindAggregation("items", "/SalesOrder", oItemSelectTemplate);
		           
		           
		           
		           
		           
		           
		           
		
		
		oModel.refresh();
	},
	handleList: function(evt){
		var model=evt.getSource().getModel();
		var modelData=model.getData();
		var key="";
		
		var listRef =this.getView().byId("idListCourse");
		var value=listRef.getSelectedItem().oBindingContexts.undefined.sPath;
		key=value.split('/SalesOrder/');
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("StudentSessions",{IV:key[1]});
	},
	onPressStudentDetailsBack: function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("overview");
	}

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
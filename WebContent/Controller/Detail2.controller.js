sap.ui.controller("com.test.Controller.Detail2", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf loginapp.App
*/
	onInit: function() {
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("StudentSessions").attachPatternMatched(this._onObjectMatched, this);
	},
	_onObjectMatched: function(oEvent){
		var that=this;
			if(oEvent==undefined){
				var model=sap.ui.getCore().getModel();
				var modelData=model.getData();
				var page = this.oView.byId("dd");
		length=modelData.SalesOrder[0].drill.length;
		var i=0,tile="";
		if(length && modelData.SalesOrder[0].drill[i].theory != undefined){
			for(i;i<length;i++){
					tile=new sap.m.GenericTile({
						header:modelData.SalesOrder[0].drill[i].theory,
						press:function(evt){
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							/*var obj = {
									key1 : modelData.SalesOrder[0].key
							}*/
							oRouter.navTo("Questions",
								{obj1:modelData.SalesOrder[0].key,
								 obj2: evt.getSource().getHeader()
								}
							);
						},
						tileContent:{
							unit:"",
							
						},
						headerImage:"sap-icon://"+modelData.SalesOrder[0].drill[i].icon,
						backgroundImage:"Images/"+Math.floor(Math.random()*30)+".jpg"
						
					
					});
					tile.addStyleClass("tileClass");
					page.addContent(tile);
				}
			}
		
		
		
		
		
		
		
	}
		var val = oEvent.mParameters.arguments.IV;
		var model=sap.ui.getCore().getModel();

		if(model){
			var modelData=model.getData();
			var length="";
			var page = this.oView.byId("dd");
			page.removeAllContent();
			if(val == undefined){
				this.getDefaultData(undefined,that);
			}
			
			if(val){
				length=modelData.SalesOrder[val].drill.length;
				var i=0,tile="";
				if(length && modelData.SalesOrder[val].drill[i].theory != undefined){
					for(i;i<length;i++){
							tile=new sap.m.GenericTile({
								header:modelData.SalesOrder[val].drill[i].theory,
								press:function(evt){
									var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									/*var obj = {
											key1 : modelData.SalesOrder[0].key
									}*/
									oRouter.navTo("Questions",
										{obj1:modelData.SalesOrder[0].key,
										 obj2: evt.getSource().getHeader()
										}
									);
								},
								tileContent:{
									unit:"",
									
								},
								headerImage:"sap-icon://"+modelData.SalesOrder[val].drill[i].icon,
								backgroundImage:"Images/"+Math.floor(Math.random()*30)+".jpg"
								
							
							});
							tile.addStyleClass("tileClass");
							page.addContent(tile);
						}
					}
			}
			
			}
		
		
		},
		
		getDefaultData(oEvent,that){
			if(oEvent==undefined){
				var model=sap.ui.getCore().getModel();
				var modelData=model.getData();
				var page = this.oView.byId("dd");
		length=modelData.SalesOrder[0].drill.length;
		var i=0,tile="";
		if(length && modelData.SalesOrder[0].drill[i].theory != undefined){
			for(i;i<length;i++){
					tile=new sap.m.GenericTile({
						header:modelData.SalesOrder[0].drill[i].theory,
						press:function(){
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("Questions",{key:modelData.SalesOrder[0].key});
						},
						tileContent:{
							unit:"",
							
						},
						headerImage:"sap-icon://"+modelData.SalesOrder[0].drill[i].icon,
						backgroundImage:"Images/"+Math.floor(Math.random()*30)+".jpg"
						
					
					});
					tile.addStyleClass("tileClass");
					page.addContent(tile);
				}
			}
		
		
		
		
		
		
		
	}
		}
		
		
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf loginapp.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf loginapp.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf loginapp.App
*/
//	onExit: function() {
//
//	}

});
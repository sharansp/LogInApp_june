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
		var key = oEvent.mParameters.arguments.obj1;
		var val = oEvent.mParameters.arguments.obj2;
		var listId=this.getView().byId('idListQuestion');
		var model=sap.ui.getCore().getModel();
		if(model)
		var modelData=model.getData();
		
		var i=0,j=0,len=modelData.SalesOrder.length;
		for(i;i<len;i++){
			if(modelData.SalesOrder[i].key == key){
				
				for(j;j<modelData.SalesOrder[i].drill.length;j++){
					if(modelData.SalesOrder[i].drill[j].theory == val){
						 var oItemSelectTemplate = new sap.m.StandardListItem({
				               
				               title: "{question}",
				               type : sap.m.ListType.Navigation
				              
				           });

						 listId.setModel(model);
						 listId.bindAggregation("items", "/SalesOrder/"+key+"/drill/"+j+"/questions", oItemSelectTemplate);
						// model.refresh();
						 break;
					}
				}
			}
		}
		
		var listLen=listId.getItems().length,i=5;
		for(i;i<listLen;i++){
			listId.getItems()[i].setVisible(false);
		}
		this.listVisibleID=5;
		this.getView().byId('idLeftNav').setEnabled(false);
		
	},
	handleBackButton: function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("StudentSessions");
	},
	handleOnDemandLoadRight: function(evt){
		if(this.listVisibleID >= 5)
			this.getView().byId('idLeftNav').setEnabled(true);
		var listId=this.getView().byId('idListQuestion');
		var i=this.listVisibleID-5,f=0,j=0;
		var listLen=0;
		if(this.listVisibleID+5 > listId.getItems().length){
			listLen=listId.getItems().length;
		}
		else{
			listLen=this.listVisibleID+5;
		}
		for(i;i<listLen;i++){
			f=f+1;
			if(f > 5 && f <= 10 && listId.getItems()[i].getVisible()==false){
				listId.getItems()[i].setVisible(true);
				j++;
			}
				
			else if(f <= 5 && listId.getItems()[i].getVisible()==true)		
			listId.getItems()[i].setVisible(false);
			
			
		}
		if(this.listVisibleID+5 <= listLen)
			this.listVisibleID=this.listVisibleID+5;
		else if(this.listVisibleID+5 > listLen){
			this.listVisibleID=listLen;
			this.getView().byId('idRightNav').setEnabled(false);
		}
			
	},
	handleOnDemandLoadLeft: function(evt){
		
		
		this.getView().byId('idRightNav').setEnabled(true);
		var listId=this.getView().byId('idListQuestion');
		var listLen=listId.getItems().length;
		
		
		
		if(this.listVisibleID >=  listLen){
			this.listVisibleID=listLen;
		}
		if(this.listVisibleID >= 5)
			this.getView().byId('idLeftNav').setEnabled(true);
		
		var i=listLen-1,f=0,j=0;
		for(i;i>=0;i--){
			if(listId.getItems()[i].getVisible()==true){
				listId.getItems()[i].setVisible(false);
			    f=1;
			}
			else if(listId.getItems()[i].getVisible()==false && f == 1 && j < 5){
				listId.getItems()[i].setVisible(true);
				j++;
			}
				
		}
		
		
		if(!(this.listVisibleID%5)){
			if(this.listVisibleID < listLen){
			//	this.getView().byId('idRightNav').setEnabled(false);
				this.listVisibleID=this.listVisibleID-5;
			}
		}
		else{
			this.listVisibleID=this.listVisibleID-(listLen%5);
		}
		/*else{
			if(listLen-(listLen%5) < this.listVisibleID){
				this.getView().byId('idRightNav').setEnabled(true);
				this.listVisibleID=this.listVisibleID-(listLen%5);
			}
		}*/
		if(this.listVisibleID <= 5)
			this.getView().byId('idLeftNav').setEnabled(false);	
	},
	handleList: function(evt){
		
		var path = evt.oSource.getSelectedContexts()[0].sPath;
		var oModel = evt.oSource.getModel()
		var ans = oModel.getProperty(path)
		var textAreaAns = this.getView().byId('idAnswer')
		textAreaAns.setText(ans.answer);
	},
	//itemPress

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
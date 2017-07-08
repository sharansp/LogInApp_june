jQuery.sap.declare("com.test.Generic.Common");
jQuery.sap.require("sap.m.MessageBox");


com.test.Generic.Common= {
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);	
		},
		
		navback : function(evt){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		}
};


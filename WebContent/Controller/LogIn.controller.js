sap.ui.controller("com.test.Controller.LogIn", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf View.LogIn
*/
	onInit: function() {
		setInterval(this.onPressChangeBG,100000);
	},
	
	onPressChangeBG: function(){
		var appId = sap.ui.getCore().byId("__xmlview0--app");
		appId.setBackgroundImage("Images/"+Math.floor(Math.random()*30)+".jpg");
	},
	onPressLogIn: function(evt){
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		if(this.getView().byId('RB1-2').getSelected())
			oRouter.navTo("StudentSessions");
		else if(this.getView().byId('RB1-1').getSelected())
		oRouter.navTo("StudentDetails");
		else
			sap.m.MessageToast.show("Kuch toh Select Kar Bhai", {
			    duration: 3000,                  // default
			    width: "15em",                   // default
			    my: "center bottom",             // default
			    at: "center bottom",             // default
			    of: window,                      // default
			    offset: "0 0",                   // default
			    collision: "fit fit",            // default
			    onClose: null,                   // default
			    autoClose: true,                 // default
			    animationTimingFunction: "ease", // default
			    animationDuration: 1000,         // default
			    closeOnBrowserNavigation: true   // default
			});

		
	},
	onPressCancel: function(evt){
		sap.m.MessageToast.show("Bhai Aandar Jaa Na...Dar mat..Kyunki Dar ke aage h Jeet h :)", {
		    duration: 3000,                  // default
		    width: "15em",                   // default
		    my: "center bottom",             // default
		    at: "center bottom",             // default
		    of: window,                      // default
		    offset: "0 0",                   // default
		    collision: "fit fit",            // default
		    onClose: null,                   // default
		    autoClose: true,                 // default
		    animationTimingFunction: "ease", // default
		    animationDuration: 1000,         // default
		    closeOnBrowserNavigation: true   // default
		});
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf View.LogIn
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf View.LogIn
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf View.LogIn
*/
//	onExit: function() {
//
//	}

});
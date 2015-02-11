sap.ui.jsview("sales-dashboard.main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf shine-so.main
	*/ 
	getControllerName : function() {
		return "sales-dashboard.main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf shine-so.main
	*/ 
	createContent : function(oController) {
		sap.app.mainController = oController;
		
		var oShell = new sap.ui.ux3.Shell({
			id : "main",
			appTitle : sap.app.i18n.getText("SHELL_HEADER_TITLE"),
			appIcon: "images/SAPLogo.gif",
			showLogoutButton : true,
			logout:function(){
				oController.logout();
			},
			showSearchTool : false,
			showFeederTool : false,
			showTools : false,
			showPane : false,
			designType : sap.ui.ux3.ShellDesignType.Crystal,
		});
		
		if (!sap.isSingle) {
			oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
				id : "nav-overview",
				text : sap.app.i18n.getText("OVERVIEW_TITLE")
			}));
			oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
				id : "nav-products",
				text : sap.app.i18n.getText("PRODUCT_REPORTS_TITLE"),
			}));
		}
		
		oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
			id : "nav-details",
			text : sap.app.i18n.getText("DETAILS_TITLE")
		}));
		
		oShell.addStyleClass('sapDkShell');

		// action when shell workset item are clicked
		oShell.attachWorksetItemSelected(function(oEvent) {
			var sViewName = oEvent.getParameter("id").replace("nav-", "");
			oShell.setContent(sap.app.mainController.getCachedView(sViewName));
		});

		// initial shell content
		if (!sap.isSingle) {
			oShell.addContent(sap.app.mainController.getCachedView("overview"));
		} else {
			oShell.addContent(sap.app.mainController.getCachedView("details"));
		}
		return oShell;
	}

});

sap.ui.controller("launchpad.main", {

    onInit: function() {

    },

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf shine_so.main
     */
    //	onInit: function() {
    //
    //	},

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf shine_so.main
     */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf launchpad.main
     */
    onAfterRendering: function() {

        var value = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_SHOW_WELCOME);
        if (value !== 'false') {
            var welcomeDialog = new sap.account.WelcomeDialog(this);
            welcomeDialog.open();
            
            // make requests for generating TIME DIMENSION data as well as to create synonyms
            // generate time dimension data
            jQuery.ajax({
                url: './launchpad/services/generateTimeData.xsjs',
                method: 'GET',
                dataType: 'text',
                async: true,
                success: function(data) {

                },
                error: function() {
                	
                }
            });
            
            // create synonyms
            var aUrl = '../admin/DataGen.xsjs?cmd=synonym';
			jQuery.ajax({
				url: aUrl,
				method: 'GET',
				dataType: 'text',
				success: function(myTxt) {
					oController.onSynonymComplete(myTxt, oController);
				},
				error: function() {
					onError(oBundle.getText("cb2a"));
				},
				async: true
			});
	            
        }
    },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf shine_so.main
     */
    //	onExit: function() {
    //
    //	}

});
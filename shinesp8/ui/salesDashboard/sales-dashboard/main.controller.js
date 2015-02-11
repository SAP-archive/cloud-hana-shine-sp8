sap.ui.controller("sales-dashboard.main", {

    // instantiated view will be added to the oViewCache object and retrieved from there
    oViewCache: {},

    onInit: function() {

    },

    /**
     * getCachedView checks if view already exists in oViewCache object, will create it if not, and return the view
     */
    getCachedView: function(viewName) {
        if (!this.oViewCache[viewName]) {
            var fullViewName = "sales-dashboard" + "." + viewName;
            this.oViewCache[viewName] = sap.ui.view({
                id: viewName,
                viewName: fullViewName,
                type: sap.ui.core.mvc.ViewType.JS
            });
        }
        return this.oViewCache[viewName];
    },

    logout: function() {
        var aUrl = "/sap/hana/xs/formLogin/token.xsjs";
        jQuery.ajax({
            url: aUrl,
            method: 'GET',
            dataType: 'text',
            beforeSend: function(jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', 'Fetch');
            },
            success: function(arg1, arg2, jqXHR) {
                var aUrl = "/sap/hana/xs/formLogin/logout.xscfunc";
                jQuery.ajax({
                    url: aUrl,
                    type: 'POST',
                    dataType: 'text',
                    beforeSend: function(jqXHR1, settings) {
                        jqXHR1.setRequestHeader('X-CSRF-Token', jqXHR.getResponseHeader('X-CSRF-Token'));
                    },
                    success: function() {
                        location.reload();
                    },
                    error: function() {

                    }
                });

            },
            error: function() {

            }
        });
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
     * @memberOf shine_so.main
     */
    //	onAfterRendering: function() {
    //
    //	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf shine_so.main
     */
    //	onExit: function() {
    //
    //	}

});
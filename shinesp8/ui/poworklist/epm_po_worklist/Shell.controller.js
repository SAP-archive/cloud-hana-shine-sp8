sap.ui.controller("epm_po_worklist.Shell", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    //   onInit: function() {
    //
    //   },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     */
    //   onBeforeRendering: function() {
    //
    //   },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    //   onAfterRendering: function() {
    //
    //   },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     */
    //   onExit: function() {
    //
    //   }

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

    getSessionInfo: function(oController, oUserTxt) {
        var aUrl = '../../services/poWorklistQuery.xsjs?cmd=getSessionInfo';

        jQuery.ajax({
            url: aUrl,
            method: 'GET',
            dataType: 'json',
            success: function(myJSON) {
                oController.onLoadSession(myJSON, oController, oUserTxt);
            },
            error: onErrorCall
        });
    },
    onLoadSession: function(myJSON, oController, oUserTxt) {
        for (var i = 0; i < myJSON.session.length; i++) {
            oUserTxt.setText(myJSON.session[i].UserName);
        }
    },
    handleExitShell: function(oEvent) {
        alert(oBundle.getText("logoff1"));
        oEvent.getSource().forceInvalidation();
        oEvent.getSource().destroy();
        sap.ui.getCore().applyChanges();
        jQuery(document.body).html("<span>" + oBundle.getText("logoff2") + "</span>");
    },

    handlePersonalizeShell: function(oEvent) {
        sap.ui.getCore().byId("myShell").openPersonalizationDialog();
    },

    handlePersonalizeShellChange: function(oEvent) {
        var data = oEvent.getParameter("settings"); // retrieve the personalization data object
        // ...now persist this data on the server or wherever personalization data is stored
        // (in-browser is not enough because the user wants his settings when logging in from another browser as well)
        // browser-only:
        if (JSON && window["localStorage"]) { // only in browsers with native JSON and offline storage support
            var string = JSON.stringify(data);
            localStorage.setItem("sapUiShellTestSettings", string);
        }
    }


});

function onErrorCall(jqXHR, textStatus, errorThrown) {
    sap.ui.core.BusyIndicator.hide();
    if (jqXHR.status == '500') {
        sap.ui.commons.MessageBox.show(jqXHR.responseText,
            "ERROR",
            oBundle.getText("error_action"));
        return;
    } else {
        sap.ui.commons.MessageBox.show(jqXHR.statusText,
            "ERROR",
            oBundle.getText("error_action"));
        return;
    }
}
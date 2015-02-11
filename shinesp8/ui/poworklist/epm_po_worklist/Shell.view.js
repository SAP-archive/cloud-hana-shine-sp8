sap.ui.jsview("epm_po_worklist.Shell", {

    getControllerName: function() {
        return "epm_po_worklist.Shell";
    },

    createContent: function(oController) {

        oController.oShell = new sap.ui.ux3.Shell("myShell", {
            appIcon: "./images/sap_18.png",
            appIconTooltip: "SAP",
            appTitle: oBundle.getText("console"),
            showLogoutButton: true,
            logout: function() {
                oController.logout();
            },
            showInspectorTool: false,
            showFeederTool: false,
            showSearchTool: false,
            designType: sap.ui.ux3.ShellDesignType.Crystal
        });
        //oController.oShell.attachLogout(oController.handleExitShell);

        createShell(oController);
        buildShellPersonalization(oController);
        buildShellNavigation(oController);
        var oSearchView = sap.ui.view({
            id: "po_search_view",
            viewName: "epm_po_worklist.Search",
            type: sap.ui.core.mvc.ViewType.JS
        });
        var oTableView = sap.ui.view({
            id: "po_table_view",
            viewName: "epm_po_worklist.Table",
            type: sap.ui.core.mvc.ViewType.JS
        });
        var oDetailView = sap.ui.view({
            id: "po_detail_view",
            viewName: "epm_po_worklist.Detail",
            type: sap.ui.core.mvc.ViewType.JS
        });

        var oLayout = new sap.ui.commons.layout.MatrixLayout();

        oLayout.createRow(oSearchView);
        oLayout.createRow(oTableView);
        oLayout.createRow(oDetailView);

        oController.oShell.setContent(oLayout);
        return oController.oShell;
    }
});

function createShell(oController) {
    var oUserTxt = new sap.ui.commons.TextView({
        //text : oBundle.getText("attendee"),
        tooltip: oBundle.getText("welcome")
    });
    oController.oShell.addHeaderItem(oUserTxt);
    //	oController.getSessionInfo(oController,oUserTxt);
    oController.oShell.addHeaderItem(new sap.ui.commons.Button({
        text: oBundle.getText("personalize"),
        tooltip: oBundle.getText("personalize"),
        press: oController.handlePersonalizeShell
    }));

    oController.oShell.addHeaderItem(new sap.ui.commons.MenuButton({
        text: oBundle.getText("help"),
        tooltip: oBundle.getText("helpm"),
        menu: new sap.ui.commons.Menu("menu1", {
            items: [new sap.ui.commons.MenuItem("menuitem1", {
                text: oBundle.getText("help")
            }), new sap.ui.commons.MenuItem("menuitem2", {
                text: oBundle.getText("incident")
            }), new sap.ui.commons.MenuItem("menuitem3", {
                text: oBundle.getText("about")
            })]
        })
    }));
}

function buildShellPersonalization(oController) {
    // EXPERIMENTAL - THIS WILL CHANGE!!
    oController.oShell._getPersonalization().attachPersonalizationChange(
        oController.handlePersonalizeShellChange);
    // initialize settings
    if (JSON && window["localStorage"]) { // only in browsers with native JSON
        // and offline storage support
        var sSettings = localStorage.getItem("sapUiShellTestSettings");
        if (sSettings) {
            oController.oShell.initializePersonalization(JSON.parse(sSettings));
        }
    }
}

function buildShellNavigation(oController) {
    var WI = sap.ui.ux3.NavigationItem;
    oController.oShell.addWorksetItem(new WI("wi_home", {
        key: "wi_home",
        text: oBundle.getText("worklist")
    }));
}
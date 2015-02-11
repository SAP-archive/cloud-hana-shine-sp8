sap.ui.jsview("ui.default", {


    getControllerName: function() {
        return "ui.default";
    },

    createContent: function(oController) {

        oController.oShell = new sap.ui.ux3.Shell("myShell", {
            appIcon: "./ui/images/sap_18.png",
            appIconTooltip: "SAP",
            appTitle: oBundle.getText("console"),
            showLogoutButton: true,
            logout: function() {
                oController.logout();
            },
            showInspectorTool: false,
            showFeederTool: false,
            showSearchTool: false,
            worksetItems: [new sap.ui.ux3.NavigationItem("wi_home", {
                key: "wi_home",
                text: oBundle.getText("worklist")
            })]
        });

//          oController.oShell.attachLogout(oController.handleExitShell);

        createShell(oController);
        buildShellPersonalization(oController);


        var oDataGenView = sap.ui.view({
            id: "epm_datagen_view",
            viewName: "ui.DataGen",
            type: sap.ui.core.mvc.ViewType.JS
        });

        var oLayout = new sap.ui.commons.layout.MatrixLayout();
        oLayout.createRow(oDataGenView);

        oController.oShell.setContent(oLayout);
        return oController.oShell;
    }
});

function createShell(oController) {

    var oUserTxt = new sap.ui.commons.TextView({

        tooltip: oBundle.getText("welcome")
    });
    oController.oShell.addHeaderItem(oUserTxt);
    oController.getSessionInfo(oController, oUserTxt);
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
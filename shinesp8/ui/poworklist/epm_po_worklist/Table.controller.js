sap.ui.controller("epm_po_worklist.Table", {

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

    //Toolbar Button Press Event Handler
    onTBPress: function(oEvent, oController) {

        //Excel Download
        if (oEvent.getSource().getId() == "btnExcel") {
            // xsjs will handle the content type and download will trigger automatically
            window.open("../../services/poWorklistQuery.xsjs?cmd=Excel");
            return;
        }

        //zip download
        if (oEvent.getSource().getId() == "btnZip") {
            var aUrl = '../../services/poWorklistQuery.xsjs?cmd=Zip';
            jQuery.ajax({
                url: aUrl,
                method: 'GET',
                dataType: 'text',
                success: function() {
                    console.log("success");
                },
                error: function() {
                    console.log("failed123");
                }
            });
        }

        //Check for selected item for all other events
        var oTable = sap.ui.getCore().byId("poTable");
        var data = oTable.getModel();
        var poId = data.getProperty("PURCHASEORDERID", oTable.getContextByIndex(oTable.getSelectedIndex()));
        if (poId === undefined) {
            sap.ui.commons.MessageBox.show(oBundle.getText("error_select"),
                "ERROR",
                oBundle.getText("error_action"));
        } else {
            //Supported Buttons - Delete and Edit
            switch (oEvent.getSource().getId()) {
                case "btnDelete":
                    sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_delete", [poId]),
                        function(bResult) {
                            oController.deleteConfirm(bResult, oController, poId);
                        },
                        oBundle.getText("title_delete"));
                    break;
                case "btnEdit":
                    break;
            }
        }

    },

    //Toolbar Menu Select Event Handler - Reject & Accept
    onMenuSelected: function(oEvent, oController) {

        //Check for selected item for all other events		 
        var oTable = sap.ui.getCore().byId("poTable");
        var data = oTable.getModel();
        var poId = data.getProperty("PURCHASEORDERID", oTable.getContextByIndex(oTable.getSelectedIndex()));
        if (poId === undefined) {
            sap.ui.commons.MessageBox.show(oBundle.getText("error_select"),
                "ERROR",
                oBundle.getText("error_action"));
        } else {
            var action;
            switch (oEvent.getParameter("itemId")) {
                case "itemReject":
                    action = "Reject";
                    break;
                case "itemAccept":
                    action = "Accept";
                    break;
            }
            sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_po", [action, poId]),
                function(bResult) {
                    oController.approvalConfirm(bResult, oController, poId, action);
                },
                oBundle.getText("confirm_title", [action]));
        }
    },

    //Table Row Select Event Handler
    onRowSelect: function(oEvent) {

    },

    //Delete Confirmation Dialog Results
    deleteConfirm: function(bResult, oController, poId) {
        if (bResult) {
            var aUrl = '../../services/poWorklistUpdate.xsjs?cmd=delete' + '&PurchaseOrderId=' + escape(poId);
            jQuery.ajax({
                url: aUrl,
                method: 'GET',
                dataType: 'text',
                success: function(myTxt) {
                    oController.onDeleteSuccess(myTxt, oController);
                },
                error: oController.onErrorCall
            });
        }
    },

    //Approve Confirmation Dialog Results
    approvalConfirm: function(bResult, oController, poId, action) {
        if (bResult) {
            var aUrl = '../../services/poWorklistUpdate.xsjs?cmd=approval' + '&PurchaseOrderId=' + escape(poId) + '&Action=' + escape(action);
            jQuery.ajax({
                url: aUrl,
                method: 'GET',
                dataType: 'text',
                success: function(myTxt) {
                    oController.onApprovalSuccess(myTxt, oController, action);
                },
                error: oController.onErrorCall
            });
        }
    },

    //Delete Successful Event Handler
    onDeleteSuccess: function(myTxt, oController) {

        oController.refreshTable();
        sap.ui.commons.MessageBox.show(oBundle.getText("delete_success"),
            "SUCCESS",
            oBundle.getText("title_delete_success"));

    },

    //Approval Successful Event Handler
    onApprovalSuccess: function(myTxt, oController, action) {

        oController.refreshTable();
        sap.ui.commons.MessageBox.show(oBundle.getText("title_approve_success", [action]),
            "SUCCESS",
            oBundle.getText("title_approve_success"));

    },

    //Error Event Handler
    onErrorCall: function(jqXHR, textStatus, errorThrown) {
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
    },

    //Utility function to refresh the table & reset # of recs in title
    refreshTable: function() {
        oTable = sap.ui.getCore().byId("poTable");
        var bindingInfo = oTable.getBindingInfo("rows");
        var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID");
        oTable.bindRows("/PO_WORKLIST", sort1, bindingInfo.filters);
        //      var iNumberOfRows = oTable.getBinding("rows").iLength;
        //  oTable.setTitle(oBundle.getText("pos", [numericSimpleFormatter(iNumberOfRows)]));  

        var columns = oTable.getColumns();
        var length = columns.length;
        for (var i = 0; i < length; i++) {
            columns[i].setFilterValue('');
            columns[i].setFiltered(false);
        }
    },

    /* Called when binding of the model is modified.
     *
     */
    onBindingChange: function(oController) {
        var view = oController.getView();
        var iNumberOfRows = view.oPHTable.getBinding("rows").iLength;
        view.oPHTable.setTitle(oBundle.getText("pos", [numericSimpleFormatter(iNumberOfRows)]));
    },
});
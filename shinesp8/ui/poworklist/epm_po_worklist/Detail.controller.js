sap.ui.controller("epm_po_worklist.Detail", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    //   onInit: function() {  //
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
    onRowSelect: function(oEvent) {
        var oView = sap.ui.getCore().byId("po_detail_view");
        var data = oEvent.getSource().getModel();
        var oTable = oEvent.getSource();
        var poId = data.getProperty("PURCHASEORDERID", oTable.getContextByIndex(oTable.getSelectedIndex()));
        var Context = "/PurchaseOrderHeader('" + poId + "')";
        var oLayout = sap.ui.getCore().byId("mLayout1");
        oLayout.bindContext(Context);


        var oTableItems = sap.ui.getCore().byId("poItemTable");
        var ContextItem = "/PurchaseOrderHeader('" + poId + "')/PurchaseOrderItem";
        var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");
        oTableItems.bindRows(ContextItem, sort1);

        var columns = oTableItems.getColumns();
        var length = columns.length;
        for (var i = 0; i < length; i++) {
            columns[i].setFilterValue('');
            columns[i].setFiltered(false);
        }

    },

    setGroupBy: function(oEvent, oController) {
        var groupBy = oEvent.oSource.getSelectedItemId();
        var aUrl = '../../services/poWorklistQuery.xsjs?cmd=getTotalOrders' + '&groupby=' + escape(groupBy) + '&currency=USD&filterterms=';

        jQuery.ajax({
            url: aUrl,
            method: 'GET',
            dataType: 'json',
            success: onLoadTotals,
            error: onErrorCall
        });
        sap.ui.core.BusyIndicator.show();

    }
});

function onLoadTotals(myJSON) {

    var data = [];
    for (var i = 0; i < myJSON.entries.length; i++) {
        data[i] = {
            label: myJSON.entries[i].name,
            data: myJSON.entries[i].value
        }
    }
    oPieModel.setData({
        modelData: data
    });
    sap.ui.core.BusyIndicator.hide();
}


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
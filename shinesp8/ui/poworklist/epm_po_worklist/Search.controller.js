sap.ui.controller("epm_po_worklist.Search", {

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

    setFilter: function(terms, attribute) {
        //filterTerms = terms;
        var mySplitResults = terms.split(' | ' + oBundle.getText("attribute") + ' ');
        gFilterTerms = mySplitResults[0];
        gFilterAttribute = mySplitResults[1];

        if (gFilterTerms == "*") this.emptyFilter();

        oTable = sap.ui.getCore().byId("poTable");

        //Change from the Display Attribute Names to the property names in the ODATA service
        switch (gFilterAttribute) {
            case 'Company Name':
            case 'Firmenname':
                gFilterAttribute = 'COMPANYNAME';
                break;
            case 'Product ID':
            case 'Produkt':
                gFilterAttribute = 'PRODUCTID';
                break;
            case 'Product Name':
            case 'Produkt Benennung':
                gFilterAttribute = 'PRODUCTNAME';
                break;
            case 'Product Description':
            case 'Produktbeschreibung':
                gFilterAttribute = 'PRODUCTDESC';
                break;
            case 'City':
            case 'Stadt':
                gFilterAttribute = 'CITY';
                break;
            case 'Category':
            case 'Kategorie':
                gFilterAttribute = 'CATEGORY';
                break;
            case 'Purchase Order ID':
            case 'Auftragsbestätigung':
                gFilterAttribute = 'PURCHASEORDERID';
                break;
        }


        //Build OData Service Sorter by PO ID, and Item
        var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");

        //Build the OData Service Filter Options
        if (gFilterTerms === "") {
            oTable.bindRows("/PO_WORKLIST", sort1, []);
        } else {
            var aflt1 = new sap.ui.model.Filter(escape(gFilterAttribute), sap.ui.model.FilterOperator.EQ, escape(gFilterTerms));
            oTable.bindRows("/PO_WORKLIST", sort1, [aflt1]);
        }

        //Set the Number of Rows in table header and clear the table lead selection
        var iNumberOfRows = oTable.getBinding("rows").iLength;
        oTable.setTitle(oBundle.getText("pos", [numericSimpleFormatter(iNumberOfRows)]));
        oTable.clearSelection();


        //When a new search is executed, the detail item area must be cleared
        var oView = sap.ui.getCore().byId("po_detail_view");
        var Context = "/PO_WORKLIST(PURCHASEORDERID='JUNK')";
        oView.bindContext(Context);

        var columns = sap.ui.getCore().byId("poTable").getColumns();
        var length = columns.length;
        for (var i = 0; i < length; i++) {
            columns[i].setFilterValue('');
            columns[i].setFiltered(false);
        }

        var oTableItem = sap.ui.getCore().byId("poItemTable");
        var ContextItem = "/PurchaseOrderHeader(PurchaseOrderId='JUNK')/PurchaseOrderItem";
        var sort1 = new sap.ui.model.Sorter("PurchaseOrderId,PurchaseOrderItem");
        oTableItem.bindRows(ContextItem, sort1);

        var columns = oTableItem.getColumns();
        var length = columns.length;
        for (i = 0; i < length; i++) {
            columns[i].setFilterValue('');
            columns[i].setFiltered(false);
        }

    },

    emptyFilter: function() {
        gFilterTerms = "";
        gFilterAttribute = "";

        oTable = sap.ui.getCore().byId("poTable");
        var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");
        oTable.bindRows("/PO_WORKLIST", sort1);
    },

    loadFilter: function(oEvent) {
        gSearchParam = oEvent.getParameter("value");
        var aUrl = '../../services/poWorklistQuery.xsjs?cmd=filter' + '&query=' + escape(oEvent.getParameter("value")) + '&page=1&start=0&limit=25';
        jQuery.ajax({
            url: aUrl,
            method: 'GET',
            dataType: 'json',
            success: onLoadFilter,
            error: onErrorCall
        });
    }
});

function onLoadFilter(myJSON) {
    var oSearchControl = sap.ui.getCore().byId("filterBy");
    var aSuggestions = [];
    for (var i = 0; i < myJSON.length; i++) {
        aSuggestions[i] = myJSON[i].terms + ' | ' + oBundle.getText("attribute") + ' ' + myJSON[i].attribute;
    }

    oSearchControl.suggest(gSearchParam, aSuggestions); //Set the found suggestions on the search control

}


function onErrorCall(jqXHR, textStatus, errorThrown) {
    sap.ui.commons.MessageBox.show(jqXHR.responseText,
        "ERROR",
        oBundle.getText("error_action"));
    return;
}
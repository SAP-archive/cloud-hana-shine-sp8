sap.ui.jsview("epm_po_worklist.Detail", {

    getControllerName: function() {
        return "epm_po_worklist.Detail";
    },

    createContent: function(oController) {

        var oModel = new sap.ui.model.odata.ODataModel("../../services/poWorklistJoin.xsodata/", false);
        this.setModel(oModel);

        var oTabStrip = new sap.ui.commons.TabStrip("tabStripDetail");
        oTabStrip.setWidth("100%");


        //General Data Tab
        buildGeneralTab(oController, oTabStrip);

        //Item Tab
        buildItemsTab(oController, oTabStrip);

        //Notes Tab
        buildNotesTab(oController, oTabStrip);

        //Reports Tab
        buildReportsTab(oController, oTabStrip);

        //Attach a controller event handler to the Header PO Table Row Select Event
        sap.ui.getCore().byId("poTable").attachEvent("rowSelectionChange", oController.onRowSelect);

        return oTabStrip;
    }
});

function buildGeneralTab(oController, oTabStrip) {

    //Purchase Order Id
    oLayout = new sap.ui.commons.layout.MatrixLayout("mLayout1", {
        columns: 4
    });
    var oText = new sap.ui.commons.TextView("txtPurchaseOrderId", {
        tooltip: oBundle.getText("poid"),
        editable: false
    });
    oText.bindProperty("text", "PurchaseOrderId");
    var oLabel = new sap.ui.commons.Label("lblPurchaseOrderId", {
        text: oBundle.getText("spoid"),
        labelFor: oText
    });

    //Partner ID
    var oText2 = new sap.ui.commons.TextView("txtPartnerId", {
        tooltip: oBundle.getText("bpart"),
        editable: false
    });
    oText2.bindProperty("text", "PartnerId");
    var oLabel2 = new sap.ui.commons.Label("lblPartnerId", {
        text: oBundle.getText("bpart"),
        labelFor: oText2
    });
    oLayout.createRow(oLabel, oText, oLabel2, oText2);

    //Employee Responsible
    var oText = new sap.ui.commons.TextView("LoginName_1", {
        tooltip: oBundle.getText("changeby"),
        editable: false
    });
    oText.bindProperty("text", "CreatedByLoginName");
    var oLabel = new sap.ui.commons.Label("lblPLoginName_1", {
        text: oBundle.getText("employee"),
        labelFor: oText
    });

    //Company Name
    var oText2 = new sap.ui.commons.TextView("txtCompanyName", {
        tooltip: oBundle.getText("company"),
        editable: false
    });
    oText2.bindProperty("text", "CompanyName");
    var oLabel2 = new sap.ui.commons.Label("lblCompanyName", {
        text: oBundle.getText("company"),
        labelFor: oText2
    });
    oLayout.createRow(oLabel, oText, oLabel2, oText2);

    //Net Amount
    oTextView1 = new sap.ui.commons.TextView().bindText("NetAmount", numericFormatter);
    oTextView1.setTextAlign(sap.ui.core.TextAlign.End);
    oTextView1.setWidth("100px");
    var oLabel = new sap.ui.commons.Label("lblNetAmount", {
        text: oBundle.getText("net"),
        labelFor: oTextView1
    });
    oTextView2 = new sap.ui.commons.TextView().bindText("Currency");
    oTextView2.setTextAlign(sap.ui.core.TextAlign.End);
    oTextView2.setWidth("30px");
    oCell = new sap.ui.commons.layout.MatrixLayoutCell();
    oCell.addContent(oTextView1);
    oCell.addContent(oTextView2);
    oLayout.createRow(oLabel, oCell);

    //Tax Amount
    oTextView1 = new sap.ui.commons.TextView().bindText("TaxAmount", numericFormatter);
    oTextView1.setTextAlign(sap.ui.core.TextAlign.End);
    oTextView1.setWidth("100px");
    var oLabel = new sap.ui.commons.Label("lblTaxAmount", {
        text: oBundle.getText("tax"),
        labelFor: oTextView1
    });
    oTextView2 = new sap.ui.commons.TextView().bindText("Currency");
    oTextView2.setTextAlign(sap.ui.core.TextAlign.End);
    oTextView2.setWidth("30px");
    oCell = new sap.ui.commons.layout.MatrixLayoutCell();
    oCell.addContent(oTextView1);
    oCell.addContent(oTextView2);
    oLayout.createRow(oLabel, oCell);

    //Gross Amount
    oTextView1 = new sap.ui.commons.TextView().bindText("GrossAmount", numericFormatter);
    oTextView1.setTextAlign(sap.ui.core.TextAlign.End);
    oTextView1.setWidth("100px");
    var oLabel = new sap.ui.commons.Label("lblGrossAmount", {
        text: oBundle.getText("gross"),
        labelFor: oTextView1
    });
    oTextView2 = new sap.ui.commons.TextView().bindText("Currency");
    oTextView2.setTextAlign(sap.ui.core.TextAlign.End);
    oTextView2.setWidth("30px");
    oCell = new sap.ui.commons.layout.MatrixLayoutCell();
    oCell.addContent(oTextView1);
    oCell.addContent(oTextView2);
    oLayout.createRow(oLabel, oCell);

    oTabStrip.createTab(oBundle.getText("general"), oLayout);
}

function buildItemsTab(oController, oTabStrip) {

    var oModelItem = new sap.ui.model.odata.ODataModel("../../services/poWorklistJoin.xsodata/", false);
    var oControl;
    oTable = new sap.ui.table.Table("poItemTable", {
        tableId: "poItems",
        visibleRowCount: 6,
        selectionMode: sap.ui.table.SelectionMode.None
    });
    oTable.setTitle(oBundle.getText("po_item"));

    //Table Column Definitions
    //Purchase Order Id
    oControl = new sap.ui.commons.TextView().bindProperty("text", "PURCHASEORDERITEM");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("item")
        }),
        template: oControl,
        sortProperty: "PURCHASEORDERITEM",
        filterProperty: "PURCHASEORDERITEM"
    }));

    //Product Id
    oControl = new sap.ui.commons.TextView().bindProperty("text", "PRODUCTID");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("product")
        }),
        template: oControl,
        sortProperty: "PRODUCTID",
        filterProperty: "PRODUCTID"
    }));

    //Product Name
    oControl = new sap.ui.commons.TextView().bindProperty("text", "PRODUCTNAME");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("product_name")
        }),
        template: oControl,
        sortProperty: "PRODUCTNAME",
        filterProperty: "PRODUCTNAME"
    }));

    //Category
    oControl = new sap.ui.commons.TextView().bindProperty("text", "CATEGORY");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("product_cat")
        }),
        template: oControl,
        sortProperty: "CATEGORY",
        filterProperty: "CATEGORY"
    }));

    //Quantity
    oControl = new sap.ui.commons.TextView().bindText("QUANTITY", numericFormatter);
    oControl.setTextAlign("End");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("quantity")
        }),
        template: oControl,
        sortProperty: "QUANTITY",
        hAlign: sap.ui.commons.layout.HAlign.End
    }));

    //Quantity Unit	
    oControl = new sap.ui.commons.TextView().bindProperty("text", "QUANTITYUNIT");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("quantity_unit")
        }),
        template: oControl,
        sortProperty: "QUANTITYUNIT",
        filterProperty: "QUANTITYUNIT"
    }));

    oTable.setModel(oModelItem);

    //Gross Amount
    oControl = new sap.ui.commons.TextView().bindText("GROSSAMOUNT", numericFormatter);
    oControl.setTextAlign("End");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("gross")
        }),
        template: oControl,
        sortProperty: "GROSSAMOUNT",
        hAlign: sap.ui.commons.layout.HAlign.End
    }));

    //Currency
    oControl = new sap.ui.commons.TextView().bindProperty("text", "CURRENCY");
    oTable.addColumn(new sap.ui.table.Column({
        label: new sap.ui.commons.Label({
            text: oBundle.getText("currency")
        }),
        template: oControl,
        sortProperty: "CURRENCY",
        filterProperty: "CURRENCY"
    }));
    oTable.setModel(oModelItem);

    oTabStrip.createTab(oBundle.getText("items"), oTable);
}

function buildNotesTab(oController, oTabStrip) {
    oLayout = new sap.ui.commons.layout.MatrixLayout("mLayout2", {
        columns: 1
    });

    // Supplier Notes	Label
    var oLabel = new sap.ui.commons.Label("lblNotes");
    oLabel.setText(oBundle.getText("supplier_note"));
    oLabel.setDesign(sap.ui.commons.LabelDesign.Bold);
    oLayout.createRow(oLabel);

    var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
        colSpan: 1
    });
    oCell.addContent(new sap.ui.commons.HorizontalDivider());
    oLayout.createRow(oCell);

    //Supplier Notes Text
    var oTextView = new sap.ui.commons.TextView();
    oTextView.bindProperty("text", "SupplierCompanyName");
    oLayout.createRow(oTextView);

    oTabStrip.createTab(oBundle.getText("notes"), oLayout);
}

function buildReportsTab(oController, oTabStrip) {

    //Group By DDLB
    oLayout = new sap.ui.commons.layout.MatrixLayout({
        width: "auto"
    });
    var oGroupBy = new sap.ui.commons.DropdownBox("DDLBGroupBy", {
        tooltip: oBundle.getText("group_by"),
        width: "200px",
        items: [new sap.ui.core.ListItem("PARTNERCOMPANYNAME", {
                text: oBundle.getText("company")
            }),
            new sap.ui.core.ListItem("PRODUCTCATEGORY", {
                text: oBundle.getText("product_cat")
            }),
            new sap.ui.core.ListItem("PARTNERCITY", {
                text: oBundle.getText("city")
            }),
            new sap.ui.core.ListItem("PARTNERPOSTALCODE", {
                text: oBundle.getText("postal")
            }),
            new sap.ui.core.ListItem("PRODUCTID", {
                text: oBundle.getText("product")
            })
        ],
        change: function(oEvent) {
            oController.setGroupBy(oEvent, oController);
        }
    });

    oGroupBy.setSelectedItemId("PARTNERCOMPANYNAME");
    oGroupBy.fireChange({
        newValue: oBundle.getText("company"),
        selectedItem: oGroupBy.getItems()[0]
    });

    //Layout Placement for Filter By Panel Content
    var oLabel = new sap.ui.commons.Label("lblPie");
    oLabel.setText(oBundle.getText("sum_gross", ["USD "]));
    oLabel.setDesign(sap.ui.commons.LabelDesign.Bold);
    oLayout.createRow(oLabel);

    var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
        colSpan: 2
    });
    oCell.addContent(new sap.ui.commons.HorizontalDivider());
    oLayout.createRow(oCell);

    //Label for Group By
    var oLabel = new sap.ui.commons.Label("lblGroupBy");
    oLabel.setText(oBundle.getText("s_group_by"));
    oLayout.createRow(oLabel, oGroupBy);

    //Pie Chart Data model - initialize empty	
    data = [{
        label: oBundle.getText("empty"),
        data: 1
    }, ];
    oPieModel.setData({
        modelData: data
    });

    var dataset = new sap.viz.ui5.data.FlattenedDataset({

        dimensions: [{
            axis: 1,
            name: oBundle.getText("s_group_by"),
            value: "{label}"
        }],

        measures: [{
            name: oBundle.getText("sum_gross", ["EUR"]),
            value: '{data}'
        }],

        data: {
            path: "/modelData"
        }

    });
    var oPie = new sap.viz.ui5.Pie("myPie", {
        width: "600px",
        height: "550px",
        plotArea: {},

        title: {
            visible: false
        },
        dataset: dataset
    });
    oPie.setModel(oPieModel);


    var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
        colSpan: 1
    });
    oCell.addContent(oPie);
    oLayout.createRow(oCell);

    oTabStrip.createTab(oBundle.getText("reports"), oLayout);
}
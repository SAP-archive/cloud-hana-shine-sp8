sap.ui.jsview("epm_po_worklist.Table", {

    getControllerName: function() {
        return "epm_po_worklist.Table";
    },

    createContent: function(oController) {

        var oModel = new sap.ui.model.odata.ODataModel("../../services/poWorklist.xsodata/", false);

        var oControl;
        var view = this;
        oTable = new sap.ui.table.Table("poTable", {
            tableId: "tableID",
            visibleRowCount: 6,
            rowSelectionChange: oController.onRowSelect,
            selectionMode: sap.ui.table.SelectionMode.Single,
            selectionBehavior: sap.ui.table.SelectionBehavior.Row,
            navigationMode: sap.ui.table.NavigationMode.Paginator
        });
        oTable.setTitle(oBundle.getText("po"));

        view.oPHTable = oTable;
        oModel.attachRequestCompleted(function() {
            oController.onBindingChange(oController);
        });

        //Table Column Definitions
        oControl = new sap.ui.commons.TextView().bindProperty("text", "PURCHASEORDERID");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("spoid")
            }),
            template: oControl,
            sortProperty: "PURCHASEORDERID",
            filterProperty: "PURCHASEORDERID",
            filterOperator: sap.ui.model.FilterOperator.EQ,
            flexible: true
        }));

        oControl = new sap.ui.commons.TextView().bindProperty("text", "PURCHASEORDERITEM");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("item")
            }),
            template: oControl,
            sortProperty: "PURCHASEORDERITEM",
            filterProperty: "PURCHASEORDERITEM",
            width: "125px"
        }));


        oControl = new sap.ui.commons.TextView().bindProperty("text", "PARTNERID");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("bpart")
            }),
            template: oControl,
            sortProperty: "PARTNERID",
            filterProperty: "PARTNERID"
        }));


        oControl = new sap.ui.commons.TextView().bindProperty("text", "PRODUCTID");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("product")
            }),
            template: oControl,
            sortProperty: "PRODUCTID",
            filterProperty: "PRODUCTID"
        }));


        oControl = new sap.ui.commons.TextView().bindProperty("text", "COMPANYNAME");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("company")
            }),
            template: oControl,
            sortProperty: "COMPANYNAME",
            filterProperty: "COMPANYNAME"
        }));


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

        oControl = new sap.ui.commons.TextView().bindProperty("text", "CURRENCY");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("currency")
            }),
            template: oControl,
            sortProperty: "CURRENCY",
            filterProperty: "CURRENCY"
        }));

        oControl = new sap.ui.commons.TextView().bindProperty("text", "LIFECYCLEDESC");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("lifecycle")
            }),
            template: oControl,
            sortProperty: "LIFECYCLEDESC",
            filterProperty: "LIFECYCLEDESC"
        }));


        oControl = new sap.ui.commons.TextView().bindProperty("text", "APPROVALDESC");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("approval")
            }),
            template: oControl,
            sortProperty: "APPROVALDESC",
            filterProperty: "APPROVALDESC"
        }));

        oControl = new sap.ui.commons.TextView().bindProperty("text", "CONFIRMATIONDESC");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("confirm")
            }),
            template: oControl,
            sortProperty: "CONFIRMATIONDESC",
            filterProperty: "CONFIRMATIONDESC"
        }));

        oControl = new sap.ui.commons.TextView().bindProperty("text", "ORDERINGDESC");
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: oBundle.getText("ordering")
            }),
            template: oControl,
            sortProperty: "ORDERINGDESCC",
            filterProperty: "ORDERINGDESC"
        }));


        oTable.setModel(oModel);

        var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");
        oTable.bindRows("/PO_WORKLIST", sort1);

        var iNumberOfRows = oTable.getBinding("rows").iLength;
        oTable.setTitle("Purchase Orders" + " (" + numericSimpleFormatter(iNumberOfRows) + ")");


        //Toolbar
        var oToolbar1 = new sap.ui.commons.Toolbar("tb1");
        oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);

        var oButton1 = new sap.ui.commons.Button("btnNew", {
            text: oBundle.getText("new"),
            tooltip: oBundle.getText("create"),
            press: function(oEvent) {
                oController.onTBPress(oEvent, oController);
            }
        });
        oToolbar1.addItem(oButton1);

        var oButton1 = new sap.ui.commons.Button("btnEdit", {
            text: oBundle.getText("edit"),
            tooltip: oBundle.getText("t_edit"),
            press: function(oEvent) {
                oController.onTBPress(oEvent, oController);
            }
        });
        oToolbar1.addItem(oButton1);

        var oButton1 = new sap.ui.commons.Button("btnDelete", {
            text: oBundle.getText("delete"),
            tooltip: oBundle.getText("t_delete"),
            press: function(oEvent) {
                oController.onTBPress(oEvent, oController);
            }
        });
        oToolbar1.addItem(oButton1);

        var oMenuButton1 = new sap.ui.commons.MenuButton("btnMenu", {
            text: oBundle.getText("actions"),
            tooltip: oBundle.getText("t_actions"),
            itemSelected: function(oEvent) {
                oController.onMenuSelected(oEvent, oController);
            }
        });
        var oMenu = new sap.ui.commons.Menu("menuTB");
        var oMenuItem;

        oMenuItem = new sap.ui.commons.MenuItem("itemAccept", {
            text: oBundle.getText("accept")
        });
        oMenu.addItem(oMenuItem);

        oMenuItem = new sap.ui.commons.MenuItem("itemReject", {
            text: oBundle.getText("reject")
        });
        oMenu.addItem(oMenuItem);

        oMenuButton1.setMenu(oMenu);
        oToolbar1.addItem(oMenuButton1);

        oToolbar1.addItem(new sap.ui.commons.ToolbarSeparator());

        var oButton1 = new sap.ui.commons.Button("btnExcel", {
            text: oBundle.getText("excel"),
            tooltip: oBundle.getText("t_excel"),
            press: function(oEvent) {
                oController.onTBPress(oEvent, oController);
            }
        });
        oToolbar1.addItem(oButton1);

        oTable.setToolbar(oToolbar1);

        return oTable;
    }
});
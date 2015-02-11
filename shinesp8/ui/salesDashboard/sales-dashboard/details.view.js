sap.ui.jsview("sales-dashboard.details", {

    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf sales-dashboard.details
     */
    getControllerName: function() {
        return "sales-dashboard.details";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf sales-dashboard.details
     */
    createContent: function(oController) {

        //code for the search view which does the fuzzy search
        sap.ui.localResources("sales-dashboard");
        var oSearchView = sap.ui.view({
            id: "so_search_view",
            viewName: "sales-dashboard.Search",
            type: sap.ui.core.mvc.ViewType.JS
        });

        var oLayout = new sap.ui.commons.layout.MatrixLayout({
            width: "100%"
        });
        oLayout.createRow(oSearchView);


        var oModel = new sap.ui.model.odata.ODataModel("../../services/salesOrders.xsodata/", true);

        oModel.attachRequestCompleted(function() {
            oController.onBindingChange(oController);
        });

        var arrayHeaders = [];
        var oControl;
        this.oSHTable = new sap.ui.table.Table("soTable", {
            tableId: "soHeader",
            visibleRowCount: 10,
            rowSelectionChange: oController.onRowSelect,
            selectionMode: sap.ui.table.SelectionMode.Single,
            navigationMode: sap.ui.table.NavigationMode.Paginator
        });
        this.oSHTable.setTitle(sap.app.i18n.getText("SALES_ORDER_HEADERS"));

        //Table Column Definitions
        oControl = new sap.ui.commons.TextView().bindProperty("text", "SALESORDERID");
        this.oSHTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("SALES_ORDER_ID")
            }),
            template: oControl,
            sortProperty: "SALESORDERID",
            filterProperty: "SALESORDERID",
            filterOperator: sap.ui.model.FilterOperator.EQ,
            flexible: true
        }));


        oControl = new sap.ui.commons.TextView().bindProperty("text", "PARTNERID.PARTNERID");
        this.oSHTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("PARTNER_ID")
            }),
            template: oControl,
            sortProperty: "PARTNERID.PARTNERID",
            filterProperty: "PARTNERID.PARTNERID"
        }));

        oControl = new sap.ui.commons.TextView().bindProperty("text", "Buyer/COMPANYNAME");
        this.oSHTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("COMPANY")
            }),
            template: oControl,
            sortProperty: "Buyer/COMPANYNAME",
            filterProperty: "Buyer/COMPANYNAME",
            filterOperator: sap.ui.model.FilterOperator.Contains
        }));

        //added for the fuzzy search feature
        oControl = new sap.ui.commons.TextView().bindProperty("text", "Buyer/CITY");
        this.oSHTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("CITY")
            }),
            template: oControl,
            sortProperty: "Buyer/CITY",
            filterProperty: "Buyer/CITY",
            filterOperator: sap.ui.model.FilterOperator.Contains
        }));


        oControl = new sap.ui.commons.TextView().bindText("GROSSAMOUNT", oController.numericFormatter);
        oControl.setTextAlign("End");
        this.oSHTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("GROSS_AMOUNT")
            }),
            template: oControl,
            sortProperty: "GROSSAMOUNT",
            hAlign: sap.ui.commons.layout.HAlign.End
        }));


        oControl = new sap.ui.commons.TextView().bindText("TAXAMOUNT", oController.numericFormatter);
        oControl.setTextAlign("End");
        this.oSHTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("TAX_AMOUNT")
            }),
            template: oControl,
            sortProperty: "TAXAMOUNT",
            hAlign: sap.ui.commons.layout.HAlign.End
        }));

        oControl = new sap.ui.commons.TextView().bindProperty("text", "CURRENCY");
        this.oSHTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("CURRENCY")
            }),
            template: oControl,
            sortProperty: "CURRENCY",
            filterProperty: "CURRENCY"
        }));

        this.oSHTable.setModel(oModel);
        var sort1 = new sap.ui.model.Sorter("SALESORDERID", true);

        this.oSHTable.bindRows({
            path: "/SalesOrderHeader",
            parameters: {
                expand: "Buyer",
                select: "SALESORDERID,CURRENCY,GROSSAMOUNT,TAXAMOUNT,PARTNERID.PARTNERID,Buyer/COMPANYNAME,Buyer/CITY"
            },
            sorter: sort1
        });

        var iNumberOfRows = this.oSHTable.getBinding("rows").iLength;
        this.oSHTable.setTitle("Sales Orders" + " (" + oController.numericSimpleFormatter(iNumberOfRows) + ")");
        oLayout.createRow(this.oSHTable);

        // Toolbar
        var oToolbar1 = new sap.ui.commons.Toolbar("tb1");
        oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);

        var oButton1 = new sap.ui.commons.Button("btnNew", {
            text: sap.app.i18n.getText("NEW"),
            tooltip: sap.app.i18n.getText("CREATE_LONG"),
            press: function(oEvent) {
                oController.onNewPress(oEvent);
            }
        });
        oToolbar1.addItem(oButton1);

        oButton1 = new sap.ui.commons.Button("btnRefresh", {
            text: sap.app.i18n.getText("REFRESH"),
            tooltip: sap.app.i18n.getText("REFRESH"),
            press: function(oEvent) {
                oController.onRefresh(oEvent);
            }
        });
        oToolbar1.addItem(oButton1);

        oButton1 = new sap.ui.commons.Button("btnDelete", {
            text: sap.app.i18n.getText("DELETE"),
            tooltip: sap.app.i18n.getText("DELETE_LONG"),
            press: function(oEvent) {
                oController.onDeletePress(oEvent);
            }
        });
        oToolbar1.addItem(oButton1);


        var helpBtn = new sap.ui.commons.Button({
            text: '?',
            press: function() {
                var tileDialog = new sap.account.TileDialog(this);
                tileDialog.open(8);
            }
        });
        helpBtn.addStyleClass('helpButton');
        oToolbar1.addItem(helpBtn);

        this.oSHTable.setToolbar(oToolbar1);

        //Sales Items
        var arrayHeaders = [];
        var oControl;
        this.oSITable = new sap.ui.table.Table("soItemTable", {
            tableId: "soItems",
            visibleRowCount: 8,
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator
        });
        this.oSITable.setTitle(sap.app.i18n.getText("SALES_ORDER_ITEMS"));

        oControl = new sap.ui.commons.TextView().bindProperty("text", "SALESORDERITEM");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("SALES_ORDER_ITEM_ID")
            }),
            template: oControl,
            sortProperty: "SALESORDERITEM",
            filterProperty: "SALESORDERITEM"
        }));

        //Product Id
        oControl = new sap.ui.commons.TextView().bindProperty("text", "PRODUCTID");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("PRODUCT")
            }),
            template: oControl,
            sortProperty: "PRODUCTID",
            filterProperty: "PRODUCTID"
        }));

        //Product Description
        oControl = new sap.ui.commons.TextView().bindProperty("text", "PRODUCT_NAME");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("PRODUCT_NAME")
            }),
            template: oControl,
            sortProperty: "PRODUCT_NAME",
            filterProperty: "PRODUCT_NAME"
        }));

        //Quantity
        oControl = new sap.ui.commons.TextView().bindText("QUANTITY", oController.numericFormatter);
        oControl.setTextAlign("End");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("QUANTITY")
            }),
            template: oControl,
            sortProperty: "QUANTITY",
            hAlign: sap.ui.commons.layout.HAlign.End
        }));

        //Quantity Unit	
        oControl = new sap.ui.commons.TextView().bindProperty("text", "QUANTITYUNIT");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("QUANTITY_UNIT")
            }),
            template: oControl,
            sortProperty: "QUANTITYUNIT",
            filterProperty: "QUANTITYUNIT"
        }));

        //Gross Amount
        oControl = new sap.ui.commons.TextView().bindText("NETAMOUNT", oController.numericFormatter);
        oControl.setTextAlign("End");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("NET_AMOUNT")
            }),
            template: oControl,
            sortProperty: "NETAMOUNT",
            hAlign: sap.ui.commons.layout.HAlign.End
        }));


        //Tax Amount
        oControl = new sap.ui.commons.TextView().bindText("TAXAMOUNT", oController.numericFormatter);
        oControl.setTextAlign("End");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("TAX_AMOUNT")
            }),
            template: oControl,
            sortProperty: "TAXAMOUNT",
            hAlign: sap.ui.commons.layout.HAlign.End
        }));


        //Currency
        oControl = new sap.ui.commons.TextView().bindProperty("text", "CURRENCY");
        this.oSITable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: sap.app.i18n.getText("CURRENCY")
            }),
            template: oControl,
            sortProperty: "CURRENCY",
            filterProperty: "CURRENCY"
        }));
        this.oSITable.setModel(oModel);

        oLayout.createRow(this.oSITable);
        return oLayout;

    },


    lineItemCount: function(oController) {
        arguments.callee.myStaticVar = arguments.callee.myStaticVar || 1;
        arguments.callee.myStaticVar++;
        return arguments.callee.myStaticVar;
    },


    createNewDialogContent: function(oController) {
        var that = this;

        var min = that.lineItemCount(oController);


        // create a simple matrix layout
        this.oLayout = new sap.ui.commons.layout.MatrixLayout({
            layoutFixed: false
        });


        this.submitButton = new sap.ui.commons.Button({
            text: sap.app.i18n.getText("CREATE"),
            style: sap.ui.commons.ButtonStyle.Accept,
            press: function() {
                var max = that.lineItemCount(oController);
                oController.onSubmit(min, max);
            }
        });

        this.addLineItemButton = new sap.ui.commons.Button({
            text: sap.app.i18n.getText("ADD_LINE_ITEM"),
            style: sap.ui.commons.ButtonStyle.Accept,
            press: function() {
                that.createNewLineItemContent(oController);
            }
        });

        this.oLayout.createRow(this.submitButton);

        this.oComboBoxBp = new sap.ui.commons.ComboBox({
            displaySecondaryValues: true,
            width: '300px',
            change: function(oEvent) {

            }

        });

        this.oComboBoxBp.setModel(new sap.ui.model.odata.ODataModel("../../services/businessPartners.xsodata",
            true));

        var oItemTemplateBp = new sap.ui.core.ListItem();
        oItemTemplateBp.bindProperty("text", "COMPANYNAME");
        oItemTemplateBp.bindProperty("additionalText", {
            parts: [{
                path: "PARTNERID"
            }],
            formatter: function(partnerid) {
                return partnerid;
            }
        });

        var oDataTemplateBp = new sap.ui.core.CustomData({
            key: "PARTNERID",
            value: "{PARTNERID}"
        });
        oItemTemplateBp.addCustomData(oDataTemplateBp);

        var sortBp = new sap.ui.model.Sorter("COMPANYNAME");
        this.oComboBoxBp.bindItems({
            path: "/BusinessPartners",
            parameters: {
                select: "PARTNERID,COMPANYNAME"
            },
            sorter: sortBp,
            template: oItemTemplateBp
        });

        var selectBpLbl = new sap.ui.commons.TextView({
            text: sap.app.i18n.getText("SELECT_BP")
        });

        this.oLayout.createRow(selectBpLbl, this.oComboBoxBp);
        that.createNewLineItemContent(oController);

        return this.oLayout;
    },

    createNewLineItemContent: function(oController) {

        var that = this;

        var lineitemindex = that.lineItemCount(oController);

        var oComboBoxPd = new sap.ui.commons.ComboBox({
            id: "productsel" + lineitemindex,
            displaySecondaryValues: true,
            width: '300px',
            change: function(oEvent) {

            }
        });


        oComboBoxPd.setModel(new sap.ui.model.odata.ODataModel("../../services/productDetails.xsodata",
            true));

        var oItemTemplatePd = new sap.ui.core.ListItem();
        oItemTemplatePd.bindProperty("text", "PRODUCT_NAME");
        oItemTemplatePd.bindProperty("additionalText", {
            parts: [{
                path: "PRODUCT_PRICE",
                type: new sap.ui.model.type.Float({
                    minFractionDigits: 2,
                    maxFractionDigits: 2
                })
            }, {
                path: "PRODUCT_CURRENCY"
            }],
            formatter: function(price, currency) {
                return price + " " + currency;
            }
        });

        var oDataTemplatePd1 = new sap.ui.core.CustomData({
            key: "PRODUCTID",
            value: "{PRODUCTID}"
        });
        oItemTemplatePd.addCustomData(oDataTemplatePd1);

        var oDataTemplatePd2 = new sap.ui.core.CustomData({
            key: "PRODUCT_CURRENCY",
            value: "{PRODUCT_CURRENCY}"
        });
        oItemTemplatePd.addCustomData(oDataTemplatePd2);

        var sortPd = new sap.ui.model.Sorter("PRODUCT_NAME");
        oComboBoxPd.bindItems({
            path: "/ProductDetails",
            parameters: {
                select: "PRODUCTID,PRODUCT_NAME,PRODUCT_PRICE,PRODUCT_CURRENCY"
            },
            sorter: sortPd,
            template: oItemTemplatePd
        });

        var selectProductLblPd = new sap.ui.commons.TextView({
            text: sap.app.i18n.getText("SELECT_PRODUCT")
        });

        // create a simple Input field
        var quantityInputPd = new sap.ui.commons.TextField({
            id: "quantitysel" + lineitemindex,
            value: "1"
        });

        var quantityLbPd = new sap.ui.commons.TextView({
            text: sap.app.i18n.getText("ENTER_QUANTITY")
        });

        var addButtonPd = new sap.ui.commons.Button({

            id: "addlineitmbtn" + lineitemindex,
            icon: "images/AddLineItem.gif",
            iconHovered: "images/AddLineItemHover.gif",
            iconSelected: "images/AddLineItemHover.gif",
            tooltip: "Add Row",
            width: "30px",
            press: function(oControlEvent) {

                //oControlEvent.getSource().getId();

                if (sap.ui.getCore().byId(oControlEvent.getSource().getId()).getTooltip_AsString() == 'Add Row') {
                    sap.ui.getCore().byId(oControlEvent.getSource().getId()).setTooltip('Remove Row');
                    sap.ui.getCore().byId(oControlEvent.getSource().getId()).setIcon("images/DeleteLineItem.gif");
                    sap.ui.getCore().byId(oControlEvent.getSource().getId()).setIconHovered("images/DeleteLineItemHover.gif");
                    sap.ui.getCore().byId(oControlEvent.getSource().getId()).setIconSelected("images/DeleteLineItemHover.gif");
                    that.createNewLineItemContent(oController);
                } else if (sap.ui.getCore().byId(oControlEvent.getSource().getId()).getTooltip_AsString() == 'Remove Row') {
                    that.oLayout.removeRow(jQuery.sap.domById(oControlEvent.getSource().getId()).parentElement.parentElement.id);
                }
            }

        });

        this.oLayout.createRow(selectProductLblPd, oComboBoxPd, quantityLbPd, quantityInputPd, addButtonPd);

    }
});
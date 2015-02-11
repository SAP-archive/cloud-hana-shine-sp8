sap.ui.jsview("sales-dashboard.products", {

    /**
     * Specifies the Controller belonging to this View. In the case that it is
     * not implemented, or that "null" is returned, this View does not have a
     * Controller.
     * 
     * @memberOf sales-dashboard.products
     */
    getControllerName : function() {
        return "sales-dashboard.products";
    },

    createContent : function(oController) {
        var oLayout = new sap.ui.commons.layout.MatrixLayout({
            width : "100%"
        });
        oLayout.setLayoutFixed(false);

        // Years Compare Panel
        var yearsComparePanel = new sap.ui.commons.Panel().setText(sap.app.i18n
                .getText("COMPARE_PRODUCT_CATEGORY_YEAR"));
        yearsComparePanel.setHeight("380px");
        yearsComparePanel.setWidth("100%");
        
		var compareHelpBtn = new sap.ui.commons.Button({
			text: '?',
			press: function() {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(5);	
			}
		});
		compareHelpBtn.addStyleClass('helpButton');
		
		yearsComparePanel.addButton(compareHelpBtn);

        var layoutNew = new sap.ui.commons.layout.MatrixLayout({
            width : "100%"
        });
        yearsComparePanel.addContent(layoutNew);
        var oModel = new sap.ui.model.odata.ODataModel(
                "../../services/salesYearCompare.xsodata",
                true);
        var sort1 = new sap.ui.model.Sorter("PRODUCT_CATEGORY");

        var currentYear = new Date().getFullYear();
        var previousYear = new Date().getFullYear() - 1;
        var dataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [ {
                axis : 1,
                name : sap.app.i18n.getText("PRODUCT_CATEGORY"),
                value : "{PRODUCT_CATEGORY}"
            } ],
            measures : [
                    {
                        name : sap.app.i18n.getText("SALES_FOR_YEAR",
                                [ previousYear ]),
                        value : '{YEAR1_NET_AMOUNT}'
                    },
                    {
                        name : sap.app.i18n.getText("SALES_FOR_YEAR",
                                [ currentYear ]),
                        value : '{YEAR2_NET_AMOUNT}'
                    }, ]
        });
        dataset.setModel(oModel);

        var bindString = "/InputParams(IP_YEAR_1='" + previousYear
                + "',IP_YEAR_2='" + currentYear + "')/Results";

        dataset.bindData(bindString, sort1);

        var oYearsCompareBarChart = new sap.viz.ui5.Column({
            width : "100%",
            height : "320px",
            title : {
                visible : false
            },
            dataset : dataset,
			yAxis :{
				label :{
					formatString: "u"
				}
			}
        });

        var xAxis = oYearsCompareBarChart.getXAxis();
        var yAxis = oYearsCompareBarChart.getYAxis();

        xAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible : true,
            text : sap.app.i18n.getText("PRODUCT_CATEGORY")
        }));

        yAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible : true,
            text : sap.app.i18n.getText("SALES_IN_EUR")
        }));

        layoutNew.createRow(oYearsCompareBarChart);

        // Product Sales Details
        var productSalesPanel = new sap.ui.commons.Panel().setText(sap.app.i18n
                .getText("PRODUCT_SALES"));
        productSalesPanel.setHeight("440px");
        productSalesPanel.setWidth("100%");
        
		var productsHelpBtn = new sap.ui.commons.Button({
			text: '?',
			press: function() {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(6);	
			}
		});
		productsHelpBtn.addStyleClass('helpButton');
		
		productSalesPanel.addButton(productsHelpBtn);

        var layoutNew = new sap.ui.commons.layout.MatrixLayout({
            width : "100%"
        });
        productSalesPanel.addContent(layoutNew);

        var oModel = new sap.ui.model.odata.ODataModel(
                "../../services/salesByProduct.xsodata",
                true);
        var sort1 = new sap.ui.model.Sorter("TOTAL_SALES");

        var dataset = new sap.viz.ui5.data.FlattenedDataset({

            dimensions : [ {
                axis : 1,
                name : sap.app.i18n.getText("PRODUCT"),
                value : "{PRODUCT_NAME}"
            } ],

            measures : [ {
                group : 1,
                name : sap.app.i18n.getText("SALES"),
                value : '{SALES}'
            }, 
            
            {
                group : 2,
                name : sap.app.i18n.getText("SALES_SHARE"),
                value : '{SHARE_SALES}'
            } ]
        });
        dataset.setModel(oModel);
        dataset.bindData("/SalesByProduct", sort1);

        var oSalesRankBubble = new sap.viz.ui5.Scatter({
            width : "100%",
            height : "380px",
            title : {
                visible : false
            },
            dataset : dataset,
			xAxis :{
				label :{
					formatString: "u"
				}
			}
        });

        xAxis = oSalesRankBubble.getXAxis();
        yAxis = oSalesRankBubble.getYAxis();

        xAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible : true,
            text : sap.app.i18n.getText("SALES_IN_EUR")
        }));

        yAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible : true,
            text : sap.app.i18n.getText("SALES_SHARE")
        }));

        oSalesRankBubble.getLegend().setIsScrollable(true); 
        
        layoutNew.createRow(oSalesRankBubble);

        oLayout.createRow(yearsComparePanel);
        oLayout.createRow(productSalesPanel)
        return oLayout;

    }

});

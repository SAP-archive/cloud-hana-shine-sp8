sap.ui.jsview("ui.DataGen", {


    getControllerName: function() {
        return "ui.DataGen";
    },

    createContent: function(oController) {
        var oLayout = new sap.ui.commons.layout.MatrixLayout();
        buildSettingsPanel(oController, oLayout);
        buildLogPanel(oController, oLayout);
        buildDataVolumePanel(oController, oLayout);

        return oLayout;
    }
});

function buildSettingsPanel(oController, oLayout) {
    var oSettingsPanel = new sap.ui.commons.Panel().setText(oBundle.getText("settings"));
    oLayout.createRow(oSettingsPanel);

    oLLayout = new sap.ui.commons.layout.MatrixLayout("mLayout1", {
        columns: 3
    });
    var oCB1 = new sap.ui.commons.RadioButton("cb1", {
        text: oBundle.getText("cb1"),
        tooltip: oBundle.getText("cbt1"),
        selected: false,
        select: function(oEvent) {
            oController.toggleDateGenerate(false, oController);
        }
    });

    var oCB2 = new sap.ui.commons.RadioButton("cb2", {
        text: oBundle.getText("cb2"),
        tooltip: oBundle.getText("cbt2"),
        selected: false,
        select: function(oEvent) {
            oController.toggleDateGenerate(false, oController);
        }
    });

    var oCB2a = new sap.ui.commons.RadioButton("cb2a", {
        text: oBundle.getText("cb2a"),
        tooltip: oBundle.getText("cbt2a"),
        selected: false,
        select: function(oEvent) {
            oController.toggleDateGenerate(false, oController);
        }
    });
    
    oLLayout.createRow(oCB1, oCB2, oCB2a);
    
    var oCB3 = new sap.ui.commons.RadioButton("cb3", {
        text: oBundle.getText("cb3"),
        tooltip: oBundle.getText("cbt3"),
        selected: false,
        select: function(oEvent) {
            oController.toggleDateGenerate(false, oController);
        }
    });

    var oCB4 = new sap.ui.commons.RadioButton("cb4", {
        text: oBundle.getText("cb4"),
        tooltip: oBundle.getText("cbt4"),
        selected: false,
        select: function(oEvent) {
        	oController.toggleDateGenerate(false, oController);
            oController.toggleGenerate(true, oController);
        }
    });
    
    var oCB5 = new sap.ui.commons.RadioButton("cb5", {
        text: oBundle.getText("cb5"),
        tooltip: oBundle.getText("cbt5"),
        selected: false,
        select: function(oEvent) {
        	 oController.toggleGenerate(false, oController);
             oController.toggleDateGenerate(true, oController);
        }
    });
    oLLayout.createRow(oCB3, oCB4, oCB5);
    oSettingsPanel.addContent(oLLayout);

    // add help button to panel
    var helpBtn = new sap.ui.commons.Button({
        text: '?',
        press: function() {
            var tileDialog = new sap.account.TileDialog(this);
            tileDialog.open();
        }
    });
    helpBtn.addStyleClass('helpButton'); // float right
    oSettingsPanel.addButton(helpBtn);

    var oInt = new sap.ui.model.type.Integer({
        minIntegerDigits: 1

    });

    var myInteger = (/^-?\d*(\.\d+)?$/);

    var oLabel1 = new sap.ui.commons.Label("lblPOVal", {
        text: oBundle.getText("lblPO"),
        labelFor: oPOVal,
        visible: false
    });
    var oPOVal = new sap.ui.commons.TextField("POVal", {
        editable: true,
        visible: false,
        value: {
            path: "",
            type: oInt
        },
        liveChange: function(oControlEvent) {
            var poValValue = oControlEvent.getParameters().liveValue;
            if (!poValValue.match(myInteger))
                sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_validPO"));
        }

    });
    oPOVal.setValue(1);
    var oTimes1 = new sap.ui.commons.TextView("times1", {
        text: " * " + numericSimpleFormatter(1000),
        visible: false
    });

    var oLabel2 = new sap.ui.commons.Label("lblSOVal", {
        text: oBundle.getText("lblSO"),
        labelFor: oSOVal,
        visible: false
    });
    var oSOVal = new sap.ui.commons.TextField("SOVal", {
        editable: true,
        visible: false,
        value: {
            path: "",
            type: oInt
        },
        liveChange: function(oControlEvent) {

            var soValValue = oControlEvent.getParameters().liveValue;
            if (!soValValue.match(myInteger))
                sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_validSO"));
        }
    });
    oSOVal.setValue(1);
    var oTimes2 = new sap.ui.commons.TextView("times2", {
        text: " * " + numericSimpleFormatter(1000),
        visible: false
    });
    //  For New DG    
    var TodayDate = new Date();
    var currentDay = TodayDate.getDate();
    var currentMonth = TodayDate.getMonth() + 1; // Jan is 0
    var currentYear = TodayDate.getFullYear();
    var startMonth = currentMonth - 1;
    var startYear = TodayDate.getFullYear();

    if (currentDay < 10) {
        currentDay = '0' + currentDay;
    }

    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth;
    }

    if (startMonth === 0) {

        startMonth = 12;
        startYear = TodayDate.getFullYear() - 1;
    }
    if (startMonth < 10) {
        startMonth = '0' + startMonth;
    }
    var startDateNum = Number(startYear + "" + startMonth + "" + currentDay);

    var TodayDateNum = Number(currentYear + "" + currentMonth + "" + currentDay);

    var oDate1 = new sap.ui.commons.DatePicker("startDate", {
        yyyymmdd: startDateNum,
        visible: false
    });
    var oLabel3 = new sap.ui.commons.Label("lblStartDate", {
        text: oBundle.getText("lblSD"),
        labelFor: oDate1,
        visible: false
    });
    var oDate2 = new sap.ui.commons.DatePicker("endDate", {
        yyyymmdd: TodayDateNum,
        visible: false,
        editable: true
    });
    var oLabel4 = new sap.ui.commons.Label("lblEndDate", {
        text: oBundle.getText("lblED"),
        labelFor: oDate1,
        visible: false
    });

    var layoutNew = new sap.ui.commons.layout.MatrixLayout({
        width: "auto"
    });
    oSettingsPanel.addContent(layoutNew);

    layoutNew.createRow(oLabel1, oPOVal, oTimes1);
    layoutNew.createRow(oLabel2, oSOVal, oTimes2);
    layoutNew.createRow(oLabel3, oDate1, oLabel4, oDate2);

    var oButton1 = new sap.ui.commons.Button("btnExecute", {
        text: oBundle.getText("btnExecute"),
        press: function(oEvent) {
            oController.execute(oEvent, oController);
        }
    });
    layoutNew.createRow(oButton1);
}

function buildLogPanel(oController, oLayout) {
    var oLogPanel = new sap.ui.commons.Panel().setText(oBundle.getText("log"));
    oLayout.createRow(oLogPanel);
    var layoutNew = new sap.ui.commons.layout.MatrixLayout({
        width: "auto"
    });
    oLogPanel.addContent(layoutNew);

    var oLabelPhase = new sap.ui.commons.Label("lblPhase", {
        text: oBundle.getText("lblPhase"),
        labelFor: oPhase
    });
    var oPhase = new sap.ui.commons.TextView("Phase", {
        text: "",
        design: sap.ui.commons.TextViewDesign.H4
    });
    layoutNew.createRow(oLabelPhase, oPhase);

    var oProgress = new sap.ui.commons.ProgressIndicator("ProgInd1", {
        width: "300px",
        percentValue: 0,
        displayValue: ""
    });
    var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
        colSpan: 2
    });
    oCell.addContent(oProgress);
    layoutNew.createRow(oCell);

    otxtLog = new sap.ui.commons.TextArea('txtLog', {
        cols: 100,
        rows: 8,
    });
    var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
        colSpan: 2
    });
    oCell.addContent(otxtLog);
    layoutNew.createRow(oCell);
}

function buildDataVolumePanel(oController, oLayout) {
    var oDataVolumePanel = new sap.ui.commons.Panel().setText(oBundle.getText("datavolume"));
    oLayout.createRow(oDataVolumePanel);

    data = [{
        label: oBundle.getText("empty"),
        value: 1,
        size: 1
    }];
    oBarModel.setData({
        modelData: data
    });

    // A Dataset defines how the model data is mapped to the chart 
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [{
            axis: 1,
            name: oBundle.getText("table"),
            value: "{label}"
        }],

        // it can show multiple measures, each results in a new set of bars in a new color 
        measures: [
            // measure 1
            {
                group: 1,
                name: oBundle.getText("size"), // 'name' is used as label in the Legend 
                value: '{record_count}' // 'value' defines the binding for the displayed value   
            }, {
                group: 2,
                name: oBundle.getText("size2"), // 'name' is used as label in the Legend 
                value: '{table_size}' // 'value' defines the binding for the displayed value   
            }
        ],

        // 'data' is used to bind the whole data collection that is to be displayed in the chart 
        data: {
            path: "/modelData"
        }

    });
    var oBarChart = new sap.viz.ui5.DualColumn({
        width: "95%",
        height: "400px",
        plotArea: {
            //'colorPalette' : d3.scale.category20().range()
        },
        title: {
            visible: true,
            text: oBundle.getText("bartitle")
        },
        dataset: oDataset,
        yAxis: {
            label: {
                formatString: "u"
            }
        }
    });

    // attach the model to the chart and display it
    oBarChart.setModel(oBarModel);
    oDataVolumePanel.addContent(oBarChart);
    oController.getTableSizes(oController);
}
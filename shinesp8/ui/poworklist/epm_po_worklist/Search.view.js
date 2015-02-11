sap.ui.jsview("epm_po_worklist.Search", {

    getControllerName: function() {
        return "epm_po_worklist.Search";
    },

    createContent: function(oController) {

        //Filter By Panel
        var searchPanel = new sap.ui.commons.Panel().setText(oBundle.getText("filter"));
        var layoutNew = new sap.ui.commons.layout.MatrixLayout({
            width: "auto"
        });
        searchPanel.addContent(layoutNew);

        // add help button
        var helpBtn = new sap.ui.commons.Button({
            text: '?',
            press: function() {
                var tileDialog = new sap.account.TileDialog(this);
                tileDialog.open(1);
            }
        });
        helpBtn.addStyleClass('helpButton');
        searchPanel.addButton(helpBtn);

        //Filter By Search Field
        var oSearch = new sap.ui.commons.SearchField("filterBy", {
            //enableListSuggest: true,
            maxHistoryItems: 0,
            enableFilterMode: true,
            startSuggestion: 1,
            maxSuggestionItems: 50,
            enableClear: true,
            width: "400px",
            search: function(oEvent) {
                oController.setFilter(oEvent.getParameter("query"), "COMPANY");
            },
            suggest: oController.loadFilter
        });


        //Layout Placement for Filter By Panel Content
        layoutNew.createRow(new sap.ui.commons.Label({
            text: oBundle.getText("s_search")
        }), oSearch);


        return searchPanel;
    }
});
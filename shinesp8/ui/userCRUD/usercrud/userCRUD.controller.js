sap.ui.controller("usercrud.userCRUD", {

    oModel: null,

    callUserService: function() {
        var oModel = sap.ui.getCore().byId("userTbl").getModel();
        var oEntry = {};
        oEntry.PERS_NO = "0000000000";
        oEntry.FIRSTNAME = sap.ui.getCore().byId("fName").getValue();
        oEntry.LASTNAME = sap.ui.getCore().byId("lName").getValue();
        oEntry.E_MAIL = sap.ui.getCore().byId("email").getValue();

        oModel.setHeaders({
            "content-type": "application/json;charset=utf-8"
        });
        oModel.create('/Users', oEntry, null, function() {
            alert("Create successful");
        }, function() {
            alert("Create failed");
        });

    },
    updateService: function(Event) {
        var oModel = sap.ui.getCore().byId("userTbl").getModel();

        oModel.submitChanges(function() {
            alert("Update successful");

        }, function() {
            alert("Update failed");
        });

    },

    onSubmitBatch: function(oController) {
        var view = oController.getView();

        var rows = view.batchLayout.getRows();

        var newUserList = [];
        for (var j = 0; j < rows.length; j++) {
            var row = rows[j];
            var user = {};
            var cells = row.getCells();
            for (var i = 0; i < 3; i++) {
                var cell = cells[i];
                var content = cell.getContent()[0];
                if (content.getPlaceholder() === "First Name") {
                    user.FIRSTNAME = content.getValue();
                } else if (content.getPlaceholder() === "Last Name") {
                    user.LASTNAME = content.getValue();
                } else {
                    user.E_MAIL = content.getValue();
                }
            }
            user.PERS_NO = "0000000000";
            newUserList.push(user);
        }

        //create an array of batch changes and save
        var oModel = sap.ui.getCore().byId("userTbl").getModel();
        var batchModel = new sap.ui.model.odata.ODataModel("../../services/userBeforeExit.xsodata/", true);
        var batchChanges = [];
        for (var k = 0; k < newUserList.length; k++) {
            batchChanges.push(batchModel.createBatchOperation("/Users", "POST", newUserList[k]));
        }

        batchModel.addBatchChangeOperations(batchChanges);
        //submit changes and refresh the table and display message  
        batchModel.submitBatch(function(data, response, errorResponse) {
            oModel.refresh();

            if (view.oDialog) {
                view.oDialog.close();
            }

            if (errorResponse && errorResponse.length > 0) {
                alert("Error occurred");
            } else {
                var resourceModel = sap.ui.getCore().getModel("i18n");
                alert(resourceModel.getResourceBundle().getText("USER_CREATED", k));
            }
        }, function(data) {
            alert("Error occurred ");
        });
    },

    onDeletePress: function(oEvent) {
        var oTable = sap.ui.getCore().byId("userTbl");
        var model = oTable.getModel();
        var userId = model.getProperty("PERS_NO", oTable.getContextByIndex(oTable.getSelectedIndex()));

        if (userId === undefined) {

            jQuery.sap.require("sap.ui.commons.MessageBox");
            sap.ui.commons.MessageBox.show(sap.ui.getCore().getModel("i18n").getProperty("SELECT_ROW"), "ERROR", "User CRUD");

        } else {

            model.remove("/" + oTable.getContextByIndex(oTable.getSelectedIndex()), {
                //context: oTable.getContextByIndex(oTable.getSelectedIndex()),
                fnSuccess: function(oData, oResponse) {
                    jQuery.sap.require("sap.ui.commons.MessageBox");
                    sap.ui.commons.MessageBox.show("User deleted successfully.", "SUCCESS", "User CRUD");
                    model.refresh();
                },
                fnError: function() {
                    jQuery.sap.require("sap.ui.commons.MessageBox");
                    sap.ui.commons.MessageBox.show("Could not delete the user.", "ERROR", "User CRUD");
                }
            });

        }
    },
});
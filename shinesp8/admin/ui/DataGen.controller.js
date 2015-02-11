sap.ui.controller("ui.DataGen", {
	/**
	 * Called when a controller is instantiated and its View
	 * controls (if available) are already created. Can be used
	 * to modify the View before it is displayed, to bind event
	 * handlers and do other one-time initialization.
	 */
	// onInit: function() {
	//
	// },
	/**
	 * Similar to onAfterRendering, but this hook is invoked
	 * before the controller's View is re-rendered (NOT before
	 * the first rendering! onInit() is used for that one!).
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is
	 * part of the document). Post-rendering manipulations of
	 * the HTML could be done here. This hook is the same one
	 * that SAPUI5 controls get after being rendered.
	 */
	// onAfterRendering: function() {
	//		
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to
	 * free resources and finalize activities.
	 */
	// onExit: function() {
	//
	// }

	getTableSizes: function(oController) {
		var aUrl = 'DataGen.xsjs?cmd=getSize';

		jQuery.ajax({
			url: aUrl,
			method: 'GET',
			dataType: 'json',
			success: onLoadSizes,
			error: function() {
				onError(oBundle.getText("table_size"));
			},
		});
	},

	execute: function(oEvent, oController) {
		var intRegex = /^\d+$/;
		//if (intRegex.test(sap.ui.getCore().byId('POVal').getValue()) && parseInt(sap.ui.getCore().byId('POVal').getValue()) !== 0) {
		//if (intRegex.test(sap.ui.getCore().byId('SOVal').getValue()) && parseInt(sap.ui.getCore().byId('SOVal').getValue()) !== 0) {

		if (sap.ui.getCore().byId('cb5').getSelected() === true) {
			if (parseInt(sap.ui.getCore().byId('POVal').getValue()) !== 0 || parseInt(sap.ui.getCore().byId('SOVal').getValue()) !== 0){

			if (new Date(sap.ui.getCore().byId('startDate').getValue()) <= new Date(sap.ui.getCore().byId('endDate').getValue())) {

				sap.ui.getCore().byId('txtLog').setValue("");
				phase1 = 0;
				phase2 = 0;
				phase3 = 0;
				phase4 = 0;
				poLoops = 0;
				soLoops = 0;
				sap.ui.getCore().byId('Phase').setText("");
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
				sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_delete"),
						function(bResult) {
					oController.executeConfirm(bResult,oController);
				},
				oBundle.getText("title_delete"));

			} else {
				sap.ui.commons.MessageBox.show(oBundle.getText("ValidDate"),"ERROR",oBundle.getText("ErrorMessage"));
				return;
			}
			}

		} else{
		
			sap.ui.getCore().byId('txtLog').setValue("");
			phase1 = 0;
			phase2 = 0;
			phase3 = 0;
			phase4 = 0;
			poLoops = 0;
			soLoops = 0;
			sap.ui.getCore().byId('Phase').setText("");
			sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
			sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
			sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_delete"),
					function(bResult) {
				oController.executeConfirm(bResult, oController);
			}, oBundle.getText("title_delete"));
			
		}
//		} else {
//		sap.ui.commons.MessageBox.show(oBundle.getText("confirm_validSO"), "ERROR",oBundle.getText("ValidNumber"));
//		return;
//		//do nothing
//		}
//		} else {
//		sap.ui.commons.MessageBox.show(oBundle.getText("confirm_validPO"), "ERROR",oBundle.getText("ValidNumber"));
//		return;
//		//d nothing
//		}
	},


	executeConfirm: function(bResult, oController) {
		//ajax call to fetch the xsrf token
		$.ajax({
			url: "/sap/hana/xs/dt/base/server/csrf.xsjs",
			type: 'HEAD',
			headers: {
				"X-CSRF-Token": "Fetch"
			},
			success: function(data, textStatus, jqXHR) {
				if (jqXHR.getResponseHeader("x-sap-login-page")) {
					return;
				}
				var securityToken = jqXHR.getResponseHeader("X-CSRF-Token");
				frames.securityToken = securityToken;
			}
		});

		if (bResult) {
			if (sap.ui.getCore().byId("cb1").getSelected()) {
				// clean up generate data in PO, SO
				var aUrl = 'DataGen.xsjs?cmd=cleanup';
				jQuery.ajax({
					url: aUrl,
					method: 'GET',
					dataType: 'text',
					success: function(myTxt) {
						oController.onCleanupComplete(myTxt, oController);
					},
					error: function() {
						onError(oBundle.getText("cb1"));
					},
					async: true
				});
			} else if (sap.ui.getCore().byId("cb2").getSelected()) {
	            // generate time dimension data
	            jQuery.ajax({
	                url: '../ui/launchpad/services/generateTimeData.xsjs',
	                method: 'GET',
	                dataType: 'text',
	                async: true,
	                success: function(data) {
	                	sap.ui.getCore().byId('txtLog').setValue(oBundle.getText("time_data_generated"));
	                },
	                error: function() {
	                	onError(oBundle.getText("cb2"));
	                }
	            });
			} else if (sap.ui.getCore().byId("cb2a").getSelected()) {
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb2a"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
				var aUrl = 'DataGen.xsjs?cmd=synonym';
				jQuery.ajax({
					url: aUrl,
					method: 'GET',
					dataType: 'text',
					success: function(myTxt) {
						oController.onSynonymComplete(myTxt, oController);
					},
					error: function() {
						onError(oBundle.getText("cb2a"));
					},
					async: true
				});
			} else if (sap.ui.getCore().byId("cb3").getSelected()) {
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb3"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
				var aUrl = 'DataGen.xsjs?cmd=resetSequence&object=';
				var tableArray = ["addressSeqId",
				                  "employeeSeqId", "partnerSeqId",
				                  "purchaseOrderSeqId", "salesOrderId",
				                  "textSeqId"
				                  ];
				for (var i = 0; i < tableArray.length; i++) {
					jQuery.ajax({
						url: aUrl + tableArray[i],
						method: 'GET',
						dataType: 'text',
						success: function(myTxt) {
							oController.onResequenceComplete(myTxt, oController, tableArray[i]);
						},
						error: function() {
							onError(oBundle.getText("cb3"));
						},
						async: true
					});
				}
			} else if (sap.ui.getCore().byId("cb4").getSelected()) {
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb4"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
				if (parseInt(sap.ui.getCore().byId('POVal').getValue()) !== 0) {
					oController.triggerReplicatePO(oController);
				}
				if (parseInt(sap.ui.getCore().byId('SOVal').getValue()) !== 0) {
					oController.triggerReplicateSO(oController);
				}
			}
			// checkbox for time based data generator
			else if (sap.ui.getCore().byId("cb5").getSelected()) {
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb5"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
				if (parseInt(sap.ui.getCore().byId('POVal').getValue()) !== 0) {
					oController.triggerReplicateTimeBasedPO(oController);
				}
				if (parseInt(sap.ui.getCore().byId('SOVal').getValue()) !== 0) {
					oController.triggerReplicateTimeBasedSO(oController);
				}
			}
		}
	},

	reloadData: function(oUrl, oController) {
		oSapBackPack = {};
		oSapBackPack.Workspace = 'SHINE_DATA';
		sapBackPack = JSON.stringify(oSapBackPack);
		$.ajax({
			url: oUrl,
			type: 'GET',
			headers: {
				"Content-Type": "text/plain;charset=UTF-8",
				"SapBackPack": sapBackPack
			},
			success: function onComplete(data) {
				frames.response = data;
				oSapBackPack.Workspace = 'SHINE_DATA';
				oSapBackPack.Activate = true;
				sapBackPack = JSON.stringify(oSapBackPack);

				$.ajax({
					url: oUrl,
					type: 'PUT',
					data: frames.response,
					headers: {
						"Content-Type": "text/plain;charset=UTF-8",
						"SapBackPack": sapBackPack,
						"X-CSRF-Token": frames.securityToken
					},
					success: function onComplete(data) {
						oController.getTableSizes();
					},
					error: function() {
						onError(oBundle.getText("put_request"));
					},
				});
			},
			error: function() {
				onError(oBundle.getText("get_request"));
			},
		});
	},

	updateReplicateProgress: function() {
		var totalPO = parseInt(sap.ui.getCore().byId('POVal').getValue(), 10);
		var totalSO = parseInt(sap.ui.getCore().byId('SOVal').getValue(), 10);
		sap.ui.getCore().byId('ProgInd1').setPercentValue(Math.round((poLoops + soLoops) / (totalPO + totalSO) * 100));
		sap.ui.getCore().byId('ProgInd1').setDisplayValue(oBundle.getText("generatedPG", [
		                                                                                  numericSimpleFormatter((poLoops + soLoops) * 1000),
		                                                                                  numericSimpleFormatter((totalPO + totalSO) * 1000)
		                                                                                  ]));
	},
	updateReplicateTimeBasedProgress: function() {
		sap.ui.getCore().byId('ProgInd1').setPercentValue(100);
		sap.ui.getCore().byId('ProgInd1').setDisplayValue(oBundle.getText("generatedTimeBased", [
		                                                                                  numericSimpleFormatter((poLoops + soLoops) * 1000)
		                                                                                  ]));
	},
	triggerReplicatePO: function(oController) {
		poLoops++;
		oController.updateReplicateProgress();
		var aUrl = 'DataGen.xsjs?cmd=replicatePO&dummy=' + oController.getUniqueTime().toString();
		jQuery.ajax({
			url: aUrl,
			method: 'GET',
			dataType: 'text',
			success: function(myTxt) {
				oController.onPOComplete(myTxt, oController);
			},
			error: function() {
				onError(oBundle.getText("purchase_order"));
			},
			async: true
		});
	},
	triggerReplicateSO: function(oController) {
		soLoops++;
		oController.updateReplicateProgress();
		var aUrl = 'DataGen.xsjs?cmd=replicateSO&dummy=' + oController.getUniqueTime().toString();
		jQuery.ajax({
			url: aUrl,
			method: 'GET',
			dataType: 'text',
			success: function(myTxt) {
				oController.onSOComplete(myTxt, oController);
			},
			error: function() {
				onError(oBundle.getText("sales_order"));
			},
			async: true
		});
	},
	// For time based data generation
	triggerReplicateTimeBasedPO: function(oController) {
		poLoops = parseInt(sap.ui.getCore().byId('POVal').getValue(), 10);
		var aUrl = 'DataGen.xsjs?cmd=replicateTimeBasedPO&startdate=' + sap.ui.getCore().byId('startDate').getValue() + '&enddate=' + sap.ui.getCore().byId("endDate").getValue() + '&noRec=' + sap.ui.getCore().byId('POVal').getValue() + '&dummy=' + oController.getUniqueTime().toString();
		jQuery.ajax({
			url: aUrl,
			method: 'GET',
			dataType: 'text',
			success: function(myTxt) {
				oController.onTimeBasedPOComplete(myTxt,oController);
			},
			error: function() {
				onError(oBundle.getText("purchase_order"));
			},
			async: true
		});
	},
	triggerReplicateTimeBasedSO: function(oController) {
		soLoops = parseInt(sap.ui.getCore().byId('SOVal').getValue(), 10);
		var aUrl = 'DataGen.xsjs?cmd=replicateTimeBasedSO&startdate=' + sap.ui.getCore().byId('startDate').getValue() + '&enddate=' + sap.ui.getCore().byId("endDate").getValue() + '&noRec=' + sap.ui.getCore().byId('SOVal').getValue() + '&dummy=' + oController.getUniqueTime().toString();
		jQuery.ajax({
			url: aUrl,
			method: 'GET',
			dataType: 'text',
			success: function(myTxt) {
				oController.onTimeBasedSOComplete(myTxt,oController);
			},
			error: function() {
				onError(oBundle.getText("sales_order"));
			},
			async: true
		});
	},
    toggleGenerate: function(selected, oController) {

        sap.ui.getCore().byId("POVal").setValue("0");
        sap.ui.getCore().byId("SOVal").setValue("0");

        sap.ui.getCore().byId("lblPOVal").setVisible(selected);
        sap.ui.getCore().byId("POVal").setVisible(selected);
        sap.ui.getCore().byId("times1").setVisible(selected);
        sap.ui.getCore().byId("lblSOVal").setVisible(selected);
        sap.ui.getCore().byId("SOVal").setVisible(selected);
        sap.ui.getCore().byId("times2").setVisible(selected);

    },
    // For time based data generation
    toggleDateGenerate: function(selected, oController) {

        sap.ui.getCore().byId("lblPOVal").setVisible(selected);
        sap.ui.getCore().byId("POVal").setVisible(selected);
        sap.ui.getCore().byId("times1").setVisible(selected);
        sap.ui.getCore().byId("lblSOVal").setVisible(selected);
        sap.ui.getCore().byId("SOVal").setVisible(selected);
        sap.ui.getCore().byId("times2").setVisible(selected);
        sap.ui.getCore().byId("lblStartDate").setVisible(selected);
        sap.ui.getCore().byId("startDate").setVisible(selected);
        sap.ui.getCore().byId("lblEndDate").setVisible(selected);
        sap.ui.getCore().byId("endDate").setVisible(selected);
        sap.ui.getCore().byId("POVal").setValue(0);
        sap.ui.getCore().byId("SOVal").setValue(0);

        if (selected) {

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
            sap.ui.getCore().byId("startDate").setYyyymmdd(startDateNum);
            sap.ui.getCore().byId("endDate").setYyyymmdd(TodayDateNum);
        }
    },

	onCleanupComplete: function(myTxt, oController) {
		
		sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog').getValue());
		oController.getTableSizes();
	},

	onSynonymComplete: function(myTxt, oController) {
		
		sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog').getValue());
		sap.ui.getCore().byId('ProgInd1').setPercentValue(100);
		sap.ui.getCore().byId('ProgInd1').setDisplayValue('100%');
		sap.ui.getCore().byId("cb2a").setSelected(false);
		oController.executeConfirm(true, oController);

	},
	onResequenceComplete: function(myTxt, oController, oObject) {
		
		sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog').getValue());
		phase3++;
		sap.ui.getCore().byId('ProgInd1').setPercentValue(Math.round(phase3 / 6 * 100));
		sap.ui.getCore().byId('ProgInd1').setDisplayValue(oBundle.getText("resequencePG", [ phase3.toString(), 6]));
		if (phase3 === 6) {
			sap.ui.getCore().byId("cb3").setSelected(false);
			oController.executeConfirm(true, oController);
			oController.getTableSizes();
		}
	},

	onPOComplete: function(myTxt, oController, i) {
		
		sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog').getValue());
		if (poLoops >= parseInt(sap.ui.getCore().byId('POVal').getValue(), 10)) {
			if (soLoops >= parseInt(sap.ui.getCore().byId('SOVal').getValue(), 10)) {
				sap.ui.getCore().byId("cb4").fireSelect({mParameters: {selected: false}});
				sap.ui.getCore().byId("lblPOVal").setVisible(false);
				sap.ui.getCore().byId("POVal").setVisible(false);
				sap.ui.getCore().byId("times1").setVisible(false);
				sap.ui.getCore().byId("lblSOVal").setVisible(false);
				sap.ui.getCore().byId("SOVal").setVisible(false);
				sap.ui.getCore().byId("times2").setVisible(false);
				oController.getTableSizes();
			}
		} else {
			oController.triggerReplicatePO(oController);
		}
	},
	onTimeBasedPOComplete: function(myTxt, oController, i) {

		sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog').getValue());
		oController.updateReplicateTimeBasedProgress();
		
		if (poLoops  >= parseInt(sap.ui.getCore().byId('POVal').getValue(), 10)) {
			if (soLoops >= parseInt(sap.ui.getCore().byId('SOVal').getValue(), 10)) {

				sap.ui.getCore().byId("cb5").setSelected(false);
				sap.ui.getCore().byId("cb5").fireSelect({mParameters: {selected: false}});
				sap.ui.getCore().byId("lblPOVal").setVisible(false);
				sap.ui.getCore().byId("POVal").setVisible(false);
				sap.ui.getCore().byId("times1").setVisible(false);
				sap.ui.getCore().byId("lblSOVal").setVisible(false);
				sap.ui.getCore().byId("SOVal").setVisible(false);
				sap.ui.getCore().byId("times2").setVisible(false);
				sap.ui.getCore().byId("startDate").setVisible(false);
				sap.ui.getCore().byId("lblStartDate").setVisible(false);
				sap.ui.getCore().byId("lblEndDate").setVisible(false);
				sap.ui.getCore().byId("endDate").setVisible(false);

				oController.getTableSizes();
			}
		} else {
			oController.triggerReplicateTimeBasedPO(oController);
		}
	},
	onTimeBasedSOComplete: function(myTxt, oController, i) { 
		
		sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog').getValue());
		oController.updateReplicateTimeBasedProgress();

		if (soLoops >= parseInt(sap.ui.getCore().byId('SOVal').getValue(), 10)) {
			if (poLoops >= parseInt(sap.ui.getCore().byId('POVal').getValue(), 10)) {
				sap.ui.getCore().byId("cb5").setSelected(false);
				sap.ui.getCore().byId("cb5").fireSelect({mParameters: {selected: false}});
				sap.ui.getCore().byId("lblPOVal").setVisible(false);
				sap.ui.getCore().byId("POVal").setVisible(false);
				sap.ui.getCore().byId("times1").setVisible(false);
				sap.ui.getCore().byId("lblSOVal").setVisible(false);
				sap.ui.getCore().byId("SOVal").setVisible(false);
				sap.ui.getCore().byId("times2").setVisible(false);
				sap.ui.getCore().byId("startDate").setVisible(false);
				sap.ui.getCore().byId("lblStartDate").setVisible(false);
				sap.ui.getCore().byId("lblEndDate").setVisible(false);
				sap.ui.getCore().byId("endDate").setVisible(false);

				oController.getTableSizes();
			}
		} else {
			oController.triggerReplicateTimeBasedSO(oController);
		}
	},
	onSOComplete: function(myTxt, oController, i) {
		sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog').getValue());
		oController.getTableSizes();
		if (soLoops >= parseInt(sap.ui.getCore().byId('SOVal').getValue(), 10)) {
			if (poLoops >= parseInt(sap.ui.getCore().byId('POVal').getValue(), 10)) {
				sap.ui.getCore().byId("cb4").setSelected(false);
				sap.ui.getCore().byId("lblPOVal").setVisible(false);
				sap.ui.getCore().byId("cb4").fireSelect({mParameters: {selected: false}});
				sap.ui.getCore().byId("POVal").setVisible(false);
				sap.ui.getCore().byId("times1").setVisible(false);
				sap.ui.getCore().byId("lblSOVal").setVisible(false);
				sap.ui.getCore().byId("SOVal").setVisible(false);
				sap.ui.getCore().byId("times2").setVisible(false);
			}
		} else {
			oController.triggerReplicateSO(oController);
		}
	},
	getUniqueTime: function() {
		var time = new Date().getTime();
		while (time == new Date().getTime())
			;
		return new Date().getTime();
	},
});

function onLoadSizes(myJSON) {

	var data = [];
	for (var i = 0; i < myJSON.entries.length; i++) {
		data[i] = {
				label: myJSON.entries[i].name,
				table_size: myJSON.entries[i].table_size,
				record_count: myJSON.entries[i].record_count
		};
	}
	oBarModel.setData({
		modelData: data
	});
}

function onError(para) {
	sap.ui.commons.MessageBox.show((para + " " + oBundle.getText("error_action")), sap.ui.commons.MessageBox.Icon.ERROR, "ERROR");
	return;
}
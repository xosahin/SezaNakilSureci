sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (Controller) {
	"use strict";

	return Controller.extend("SezaNakilSureci.SezaNakilSureci.controller.View1", {
		_islemTip: "",
		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
			/*	this.getRouter().getRoute("View1").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("View1").attachPatternMatched(this._onObjectMatched, this);
	*/
			var oModel = this.getOwnerComponent().getModel();
			var aDeferredGroups = oModel.getDeferredGroups();
			aDeferredGroups = aDeferredGroups.concat(["nakil", "plaka"]);
			oModel.setDeferredGroups(aDeferredGroups);
			oModel.setChangeGroups({
				"NakilGet": {
					groupId: "nakil",
					changeSetId: "Nakil",
					single: false
				},
				"PlakaYarat": {
					groupId: "plaka",
					changeSetId: "Plaka",
					single: false
				}
			});
		},
		onSave: function () {
			var that = this;
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var messageHandler = this.getOwnerComponent().MessageHandler;
			messageHandler.removeServiceMessages();
			var oTable = this.getView().byId("NakilSearch").getTable();
			var aSelectedIndices = oTable.getSelectedIndices(); // test 3				
			var oModel = this.getOwnerComponent().getModel();
			// oModel.setDeferredGroups(["foo"]);
			var mParameters = {
				groupId: "nakil",
				success: function (odata, resp) {
					messageHandler.showServiceMessagePromise().then(function () {
						// oModel.refresh();
						that.clearHeaderChanges();
					});
				},
				error: function (odata, resp) {
					messageHandler.showServiceMessagePromise().then(function () {
						that.clearHeaderChanges();
					});
				}
			};
			var aChangesToDelete = [];
			var oPendingChanges = oModel.getPendingChanges();
			for (var key in oPendingChanges) {
				var flag = false;
				for (var i = 0, len = aSelectedIndices.length; i < len; i++) {
					var oContext = oTable.getContextByIndex(aSelectedIndices[i]);
					var sPath = oContext.getPath().substr(1);
					if (key == sPath) {
						flag = true;
						break;
					}
				}
				if (!flag) {
					aChangesToDelete.push("/" + key);
				}
			}
			if (aChangesToDelete.length > 0) {
				oModel.resetChanges(aChangesToDelete);
			}

			if (this._islemTip) {
				for (var i = 0, len = aSelectedIndices.length; i < len; i++) {
					var context = oTable.getContextByIndex(aSelectedIndices[i]);
					var path = context.getPath();
					oModel.setProperty(path + "/IsProcess", true);
					// 	var rowData = oContext.getObject();
					// var serviceData = {
					// 	"Sto": rowData.Sto,
					// 	"StoEbelp": rowData.StoEbelp,
					// 	"KayitNo": rowData.KayitNo,
					// 	"Werks": rowData.Werks,
					// 	"Lgort": rowData.Lgort,
					// 	"Matnr": rowData.Matnr,
					// 	"Maktx": rowData.Maktx,
					// 	"Ebeln": rowData.Ebeln,
					// 	"Miktar": rowData.Miktar,
					// 	"Meins": rowData.Meins,
					// 	"Plaka": rowData.Plaka,
					// 	"Tckn": rowData.Tckn,
					// 	"Sofor": rowData.Sofor,
					// 	"Naklyc": rowData.Naklyc,
					// 	"Vagon": rowData.Vagon,
					// 	"Kont1": rowData.Kont1,
					// 	"Kont2": rowData.Kont2,
					// 	"McBelge": rowData.McBelge,
					// 	"TkBelge": rowData.McBelge,
					// 	"MgBelge": rowData.MgBelge,
					// 	"IslemTip": rowData.MgBelge
					// };
					// 	oModel.update(sPath, serviceData, mParameters);
				}
			}
			oModel.submitChanges(mParameters);

		},
		isTherePlakaChange: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oPendingChanges = oModel.getPendingChanges();
			for (var key in oPendingChanges) {
				if (key.search("PlakaYaratSet") > -1) {
					return true;
				}
			}
			return false;
		},

		onCreatePlate: function () {
			// get selected data from table (reference of table)
			var oTable = this.getView().byId("NakilSearch");
			var oModel = this.getOwnerComponent().getModel();
			// get the fragment
			var oDialog = this._getDialog();
			oDialog.setModel(oModel);
			var oContext = oModel.createEntry("/PlakaYaratSet", {
				"groupId": "plaka"
			});
			oDialog.bindElement({
				path: oContext.getPath()
			});
			oDialog.open();

			// get the reference of input fields of fragment and set the values
		},
		_getDialog: function () {
			// create a fragment with dialog, and pass the selected data
			if (!this.dialog) {
				// This fragment can be instantiated from a controller as follows:
				this.dialog = sap.ui.xmlfragment("SezaNakilSureci.SezaNakilSureci.view.fragment.plaka2", this);
				this.getView().addDependent(this.dialog);
				//debugger;
			}
			//debugger;
			return this.dialog;
		},
		closeDialog: function () {
			this._getDialog().close();
		},
		onPlateSave: function () {
			//debugger;
			var that = this;
			var messageHandler = this.getOwnerComponent().MessageHandler;
			var oModel = this.getOwnerComponent().getModel();
			var mParameters = {
				groupId: "plaka",
				success: function (odata, resp) {
					messageHandler.showServiceMessagePromise().then(function () {
						that.closeDialog();
						// oModel.refresh(true);
					});
				},
				error: function (odata, resp) {
					messageHandler.showServiceMessagePromise().then(function () {
						that.closeDialog();
						// oModel.refresh(true);

					});
				}
			};
			oModel.submitChanges(mParameters);

			// var oPlaka = sap.ui.getCore().byId("plaka").getValue();
			// var oTopAgirlik = sap.ui.getCore().byId("topAgirlik").getValue();
			// var oBirim = sap.ui.getCore().byId("birim").getValue();
			// var oNakliyeci = sap.ui.getCore().byId("nakliyeci").getValue();
			// var oRuhsatSahibi = sap.ui.getCore().byId("ruhsatSahibi").getValue();
			// var oTckn = sap.ui.getCore().byId("tckn").getValue();

			// var finalData = {
			// 	"Plaka": oPlaka,
			// 	"TopAgirlik": oTopAgirlik,
			// 	"Birim": oBirim,
			// 	"Nakliyeci": oNakliyeci,
			// 	"RuhsatSahibi": oRuhsatSahibi,
			// 	"Tckn": oTckn
			// };

		},
		handleIslemChange: function (oEvent) {

		},
		handleSearch: function (oEvent) {
			var smartTable = this.getView().byId("NakilSearch");
			var filterData = oEvent.getSource().getFilterData();
			var isEditable = false;
			if (filterData.IslemTip == "1") {
				isEditable = true;
			}
			smartTable.setEditable(isEditable);
			this._islemTip = filterData.IslemTip;

		},
		handleAfterCloseDialog: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oPendingChanges = oModel.getPendingChanges();
			var aPaths = [];
			for (var key in oPendingChanges) {
				if (key.search("PlakaYaratSet") > -1) {
					// return true;
					aPaths.push("/" + key);
				}
			}
			if (aPaths.length > 0) {
				oModel.resetChanges(aPaths);
			}
		},
		clearHeaderChanges: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oPendingChanges = oModel.getPendingChanges();
			var aPaths = [];
			for (var key in oPendingChanges) {
				if (key.search("PlakaYaratSet") > -1) {
					// return true;
					aPaths.push("/" + key);
				}
			}
			if (aPaths.length > 0) {
				oModel.resetChanges(aPaths);
			}
		}

	});
});
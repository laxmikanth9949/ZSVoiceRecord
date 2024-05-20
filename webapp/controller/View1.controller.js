sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.sample.ZSVoiceRecord.controller.View1", {
		onInit: function () {

			var recognition = new window.webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.lang = 'en-IN';
			this.recognition = recognition;

		},
		onStartRecording: function () {
			var final_transcript = "";
			var that = this;
			this.recognition.start();
			MessageToast.show("Recording started");
			this.recognition.onstart = function () {};
			this.recognition.onresult = function (event) {

				var interim_transcript = "";

				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript;
					} else {
						interim_transcript += event.results[i][0].transcript;
						console.log(interim_transcript);
					}

				}

				if (final_transcript != "") {
					that.submitValue(final_transcript);
					final_transcript = "";
				}
			};
		},
		submitValue: function (final_transcript) {

			var oRouter = this.getOwnerComponent().getRouter();
			var key = final_transcript.toLowerCase().trim();
			console.log("Key:" + key);
			switch (key) {
			case "quality results recording":
				oRouter.navTo("View2");
				this.recognition.stop();
				break;
			case "quality results review":
				oRouter.navTo("View3");
				this.recognition.stop();
				break;
			case "quality results approval":
				oRouter.navTo("View4");
				this.recognition.stop();
				break;
			}
		},
		onSubmitValue: function (sValue) {

			if (sValue.trim().toLowerCase() == "next") {
				this.count = this.count + 1;
				this.getView().byId('table1').getRows()[this.count].getCells()[1].focus();
			} else if (sValue.trim().toLowerCase() == "back") {
				this.count = this.count - 1;
				this.getView().byId('table1').getRows()[this.count].getCells()[1].focus();
			} else if (sValue.trim().toLowerCase() == "focus") {
				MessageToast.show("Setting focus..");
				setFocus = true;
			} else {

				var path = '/items/' + this.count + '/KPIValue';
				this.getView().getModel('oModel2').setProperty(path, sValue.trim());
			}

		},
		setKPIFocus: function (sValue) {
			var path;
			var totalCount = Object.keys(this.getView().getModel('oModel2').getProperty('/items')).length;
			for (var i = 0; i < totalCount; i++) {
				path = '/items/' + i + '/QualityKPI';

				if (this.getView().getModel('oModel2').getProperty(path).toLowerCase() == sValue.trim().toLowerCase()) {
					this.count = i;

					MessageToast.show("Focus set on " + sValue);
					setFocus = false;
					this.getView().byId('table1').getRows()[i].getCells()[1].focus();
					break;
				}

			}

		},
		
		onNameRecording: function (oEvent) {
			var final_transcript = "";
			var that = this;
		
				this.oEvent = oEvent;
			
			this.recognition.start();
			MessageToast.show("Recording started");
			this.recognition.onstart = function () {};
			this.recognition.onresult = function (event) {

				var interim_transcript = "";

				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript;
					} else {
						interim_transcript += event.results[i][0].transcript;
						console.log(interim_transcript);
					}

				}

				if (final_transcript != "") {
				//	that.submitValue(final_transcript);
					if (that.oEvent.getParameters().id === "__button0") {
						that.getView().byId("nameText").setValue(final_transcript);
						that.recognition.stop();
					}else if (that.oEvent.getParameters().id === "__button1") {
						that.getView().byId("nameEmail").setValue(final_transcript);
						that.recognition.stop();
					}else if(that.oEvent.getParameters().id === "__button2"){
						final_transcript = final_transcript.replace(/\s/g, "");
						if(final_transcript.length === 8){
							var final_DOB = final_transcript.split("")[0] + final_transcript.split("")[1] + "-" + final_transcript.split("")[2] + final_transcript.split("")[3] + "-" + final_transcript.split("")[4] + final_transcript.split("")[5] + final_transcript.split("")[6] + final_transcript.split("")[7];
						that.getView().byId("dobText").setValue(final_DOB);
						that.getView().byId("dobText").setValueState("None");
						that.recognition.stop();
						}else{
							that.dobInformation();
							that.getView().byId("dobText").setValueState("Error");
							that.recognition.stop();
						}
					}else if (that.oEvent.getParameters().id === "__button4") {
						that.getView().byId("nameCity").setValue(final_transcript);
						that.recognition.stop();
					}else if (that.oEvent.getParameters().id === "__button5") {
						that.getView().byId("nameZipcode").setValue(final_transcript);
						that.recognition.stop();
					}else if (that.oEvent.getParameters().id === "__button6") {
						that.getView().byId("nameRegion").setValue(final_transcript);
						that.recognition.stop();
					}else if (that.oEvent.getParameters().id === "__button7") {
						that.getView().byId("nameCountry").setValue(final_transcript);
						that.recognition.stop();
					}
					else if(final_transcript === "clear"){
						that.onClear();
						that.recognition.stop();
					}else{
						MessageToast.show("Please Say Clear");
						that.recognition.stop();
					}
					final_transcript = "";
				}
			};
		},
		dobInformation: function(oEvent){
			MessageBox.show("Please say your Date Of Birth as like Date, Month, Year format(DDMMYYYY).\n\n Example: \n\n  If your Date Of Birth is 01-01-1990 then just you say as like \n Zero One, Zero One, One Nine Nine Zero",{
				title:"Information About Date Of Birth",
				icon:MessageBox.Icon.INFORMATION
			});
		},
		onClear: function(oEvent){
			this.getView().byId("nameText").setValue("");
			this.getView().byId("nameEmail").setValue("");
			this.getView().byId("dobText").setValue("");
			this.getView().byId("nameCity").setValue("");
			this.getView().byId("nameZipcode").setValue("");
			this.getView().byId("nameRegion").setValue("");
			this.getView().byId("nameCountry").setValue("");
			this.getView().byId("nameWebpage").setValue("");
			this.getView().byId("nameTwitter").setValue("");
		},
		onClearAllFileds: function(){
			this.onClear();
		},
		onAfterRendering: function(){
			
			if(!this.getView().byId("idClear").getEnabled()){
				this.getView().byId("idClear").setTooltip(this.getView().getModel("i18n").getResourceBundle().getText("if_notImplemented"));
			}else if(!this.getView().byId("idClearMic").getEnabled()){
				this.getView().byId("idClear").setTooltip(this.getView().getModel("i18n").getResourceBundle().getText("if_notImplemented"));
			}else if(!this.getView().byId("idSubmit").getEnabled()){
				this.getView().byId("idSubmit").setTooltip(this.getView().getModel("i18n").getResourceBundle().getText("if_notImplemented"));
			}else if(!this.getView().byId("idSubmitMic").getEnabled()){
				this.getView().byId("idSubmitMic").setTooltip(this.getView().getModel("i18n").getResourceBundle().getText("if_notImplemented"));
			}
		}
	});
});

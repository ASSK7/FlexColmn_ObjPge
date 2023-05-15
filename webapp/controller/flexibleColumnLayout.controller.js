sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox) {
        "use strict";

        return Controller.extend("com.dp.onlinekart.controller.flexibleColumnLayout", {
            onInit: function() {
                var oModel = new JSONModel();
                var that = this;
                //oModel.attachRequestCompleted(function(){
                //	debugger;
                //});
                oModel.loadData("./model/data.json");
                this.getView().setModel(oModel,"products");
                
                this.getOwnerComponent().getRouter().getRoute("flexibleColumnLayout").attachPatternMatched(this._getUserDetails,this);
                
           },
           _getUserDetails : function(oEvent){
            var user = oEvent.getParameter("arguments").user;
             var oModel = new JSONModel();
              //oModel.loadData("./model/credentials.json");
              
              oModel.loadData("./model/credentials.json");
              this.getView().setModel(oModel,"user");
              var that = this;
              oModel.attachRequestCompleted(function(){
                    var users = sap.ui.getCore().byId("__xmlview1").getModel("user").getData().logins;
                    
                    for(var i=0;i<users.length;i++){
                        if(user === users[i].uname){
                            sap.ui.getCore().byId("__xmlview1").getModel("user").getData().logins = users[i];
                            sap.ui.getCore().byId("__xmlview1").getModel("user").refresh(true);
                            break;
                        }
                    }
                    
                });
            
       },
           onTable : function(oEvent){
               this.getView().getModel('products').getData().layout = 'TwoColumnsMidExpanded';
               this.getView().getModel('products').refresh(true);
               
               this.path = parseInt(oEvent.getSource().getBindingContextPath().split('/')[2]);
            //    var prodDetailSF = oEvent.getSource().getParent().getParent().getParent().getCurrentMidColumnPage().getSections()[0].getSubSections()[0].getBlocks()[0];
            var prodDetailSF = oEvent.getSource().getParent().getParent().getParent().getParent().getCurrentMidColumnPage().getSections()[0].getSubSections()[0].getBlocks()[0];   
            var checkOutSF = oEvent.getSource().getParent().getParent().getParent().getParent().getCurrentMidColumnPage().getSections()[1].getSubSections()[0].getBlocks()[0];
               var selQty = checkOutSF.getContent()[5].getValue();
               prodDetailSF.bindElement("products>/items/"+this.path);
               checkOutSF.bindElement("products>/items/"+this.path);
           },
           onOrder : function(oEvent){
               // var oTable = oEvent.getSource().getParent().getParent().getParent().getCurrentMidColumnPage().getSections()[2].getSubSections()[0].getBlocks()[0];
               var data = JSON.parse(JSON.stringify(this.getView().getModel('products').getData().items[this.path]));
               var qty = oEvent.getSource().getParent().getParent().getParent().getParent().getContent()[5].getValue();
               var total = data.price * qty;
               if( qty > 0){
               
               data["quantity"] = qty;
               data["total"] = total;
               var flag = '';
               
               if(this.getView().getModel('products').getData().orders == undefined){
                   this.getView().getModel('products').setProperty('/orders',[data]);
               }
               else{
                 for(var i=0;i<this.getView().getModel('products').getData().orders.length;i++){
                     if(this.getView().getModel('products').getData().orders[i].title == data.title){
                          flag = i;
                     }
                    
                 }
                 
                 if(flag !== ''){
                    var i = flag;
                    this.getView().getModel('products').getData().orders[i].quantity = this.getView().getModel('products').getData().orders[i].quantity + data.quantity;
                         this.getView().getModel('products').getData().orders[i].total = this.getView().getModel('products').getData().orders[i].total + data.total;
                 }
                 else{
                    this.getView().getModel('products').getData().orders.push(data);
                 }
                     
               }
               
               this.getView().getModel('products').refresh(true);
               }
               else{
                   MessageBox.warning('Please select quantity');
               }
               
               oEvent.getSource().getParent().getParent().getParent().getParent().getContent()[5].setValue(0);
               
           }
        });
    });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("com.dp.onlinekart.controller.LoginPage", {
            onLogin: function(oEvent) {
                var user = oEvent.getSource().getParent().getItems()[1].getValue();
                var password = oEvent.getSource().getParent().getItems()[2].getValue();
    
                // var users = [];
                var that = this;
    
                // $.ajax({
                //    url: "./model/credentials.json",
                //        //force to handle it as text
                //    dataType: "text",
                //         success: function (dataTest) {
    
                //             //data downloaded so we call parseJSON function 
                //             //and pass downloaded data
                //             var json = $.parseJSON(dataTest);
                //         }
                // });    //another method to fetch the local files
    
                fetch("./model/credentials.json")
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        var oView = sap.ui.getCore().getElementById('__xmlview0');
                        var oBtn = sap.ui.getCore().getElementById('__xmlview0').byId('idbtn');
    
                        var users = data.logins;
    
                        var iUser = oBtn.getParent().getItems()[1].getValue().toUpperCase();
                        var iPass = oBtn.getParent().getItems()[2].getValue();
    
                        var msg;
    
                        for (var i = 0; i < users.length; i++) {
                            if (iUser === users[i].uname && iPass === users[i].password) {
                                oView.getParent().getParent().getParent().getRouter().navTo('flexibleColumnLayout',{
                                    user : iUser
                                });
                                msg = '';
                                break;
    
                            } else {
                                if (iUser !== users[i].uname) {
                                    msg = 'User not available';
    
                                } else {
                                    msg = 'Wrong Password';
                                    break;
                                }
                                
                            }
                        }
                        if(msg !== ''){
                            MessageBox.error(msg);
                        }
    
                    });
    
                if (user.length == 0 || password.length == 0) {
                    MessageBox.error('Kindly fill all the details');
                    oEvent.getSource().getParent().getItems()[1].setValueState('Error');
                    oEvent.getSource().getParent().getItems()[2].setValueState('Error');
                } else {
                    oEvent.getSource().getParent().getItems()[1].setValueState('None');
                    oEvent.getSource().getParent().getItems()[2].setValueState('None');
    
                    
    
                }
    
            }
        });
    });

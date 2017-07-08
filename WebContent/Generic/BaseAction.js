jQuery.sap.declare("com.test.Generic.BaseAction");

sap.ui.core.mvc.Controller.extend("com.test.Generic.BaseAction", {

 getValidObject:function(objContext,strSerialObject){

        if(!strSerialObject || strSerialObject=="undefined" || strSerialObject=="null" && $.trim(strSerialObject)=="" ){
            return null;
        }
        var intLoop=0;
        var arySerial =(strSerialObject).toString().split(".");
        var objReturn=objContext;
        var len=arySerial.length;
        while(objReturn && intLoop<len)
        {
            objReturn=objReturn[arySerial[intLoop]];
            intLoop++;   
        }
        return objReturn; 
    },
    loadActionConfig:function(keyValue){

        if(keyValue && keyValue!=""){
            var filePath = this.getValidObject(util.Structure.APPS,keyValue+".config");
            this.requireActionConfig(filePath)
        }
    },
    requireActionConfig:function(filePath){

        if(filePath && filePath!="")
        {
            jQuery.sap.require(filePath);
            this.setActionConfig(this.getActionConfigId(filePath));        
        }
        
    },
    getActionConfigId:function(actionConfig){
        var aryFilePath = actionConfig.toString().split(".");
        return aryFilePath[aryFilePath.length-1];
    },
    setActionConfig:function(actionConfigId){

        this.actionConfigInfo = this.getValidObject
                            ( 
                                view,
                                "ActionConfig."+ actionConfigId
                            ); 
    },
    getTargetInbox:function(keyValue){
        var  that= this;
        return that.getValidObject
                (
                    util.Config,
                    that.getValidObject
                    (
                        that,
                        "actionConfigInfo.pickerInbox."+keyValue
                    )
                );
    },
    getBapiSetting:function(babiType){
         return this.getValidObject
               (
                     this,
                     "actionConfigInfo.bapiName."+ babiType
               );
    },
    getBapiName:function(babiType){

        return this.getValidObject
               (
                     this,
                     "actionConfigInfo.bapiName."+ babiType +".name" 
               );
    },
    getServiceSettings:function(serviceType){

        return this.getValidObject
               (
                     this,
                     "actionConfigInfo.services."+serviceType 
               );
    },
    getServiceUrl:function(serviceType){
        
        var  objService = this.getServiceSettings(serviceType);
        var service = this.getValidObject(objService,"service");
        var domain = this.getValidObject(objService,"domain");
        var bindPath = this.getValidObject(objService,"bindPath");
        var url;
        if( service && domain && bindPath)
        {
            url = util.ServiceConfig.getHanaHostName(domain) +
                  service +
                  util.ParamHelper.replaceProfileParams(bindPath)
        }       
        return url;

    },
    getBapiPostUrl:function(babiType){
        var objBapi =this.getBapiSetting(babiType);
        var system = this.getValidObject(objBapi,"system");
        var name = this.getValidObject(objBapi,"name");
        return util.ServiceConfig.getBapiPostUrl(system,name);
    },
    getBapiMetadata:function(babiType){
        var objBapi =this.getBapiSetting(babiType);
        var system = this.getValidObject(objBapi,"system");
        var name = this.getValidObject(objBapi,"name");
        return util.ServiceConfig.getBapiMetadata(system,name);
    }
});
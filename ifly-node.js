var iFlyNode = {};
var _iFlyNode = {};


var request = require('request');
var _ = require('lodash');

_iFlyNode.settings = {};

_iFlyNode.settings.HOST = 'http://api.iflychat.com';
_iFlyNode.settings.A_HOST = 'https://api.iflychat.com';
_iFlyNode.settings.PORT = '80';
_iFlyNode.settings.A_PORT = '443';
_iFlyNode.settings.version = '1.1.0';

_iFlyNode.userDetails = {};

iFlyNode.init = function(api_key, app_id, popup) {
  _iFlyNode.settings.apiKey = api_key;
  _iFlyNode.settings.appId = app_id;
  _iFlyNode.settings.popUp = popup;
};

_iFlyNode.returnToken = function(token) {
  _iFlyNode.token = token;
};

iFlyNode.getToken = function(cb) {

  //if(typeof _iFlyNode.userDetails.userName === 'undefined'){
    // _iFlyNode.userDetails = user_details;
  //}
  var data = {};
  data.api_key = _iFlyNode.settings.apiKey;
  data.app_id = _iFlyNode.settings.appId;
  data.user_name = _iFlyNode.userDetails.userName;
  data.user_id = _iFlyNode.userDetails.userId;
  data.version = _iFlyNode.settings.version;
  data.chat_role = 'participant';
  if(_.has(_iFlyNode.userDetails,'isMod') && _iFlyNode.userDetails.isMod === true) {
    data.chat_role = 'moderator';
  }
  if(_.has(_iFlyNode.userDetails,'isAdmin') && _iFlyNode.userDetails.isAdmin === true) {
    data.user_roles = 'admin';
    data.user_site_roles = _iFlyNode.userDetails.userSiteRoles;
    data.chat_role = 'admin';
  }
  else {
    data.user_roles = {};
    for(var i in _iFlyNode.userDetails.userRoles) {
      data.user_roles[i] = _iFlyNode.userDetails.userRoles[i];
    }
  }
  if(!_.isEmpty(_iFlyNode.userDetails.userAvatarUrl)) {
    data.user_avatar_url = _iFlyNode.userDetails.userAvatarUrl;
  }
  if(!_.isEmpty(_iFlyNode.userDetails.userProfileUrl)) {
    data.user_profile_url = _iFlyNode.userDetails.userProfileUrl;
  }
  if(_iFlyNode.userDetails.relationshipsSet){
    data.user_list_filter = 'friend';
    var final_list = {};
    final_list['1'] = {};
    final_list['1']['name'] = 'friend';
    final_list['1']['plural'] = 'friends';
    final_list['1']['valid_uids'] = _iFlyNode.userDetails.userRelationships;
    data.user_relationships = final_list;
  }else{
    data.user_list_filter = 'all';
  }

  if(!_.isEmpty(_iFlyNode.userDetails.userGroups)) {
    data.user_list_filter = 'group';
    data.user_groups = {};
    for(var i in _iFlyNode.userDetails.userGroups) {
      data.user_groups[i] = _iFlyNode.userDetails.userGroups[i];
    }
  }

  request.post(_iFlyNode.settings.A_HOST + ':' + _iFlyNode.settings.A_PORT + '/api/1.1/token/generate',
  {
    form: data
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(response.body);
      return cb(false, obj);
    }
    else {
      return cb(true, false);
    }
  });

};

_iFlyNode.loadPopUp = function() {
  var r = '';
  if (_iFlyNode.settings.popUp === true) {
    r += '<script>var iFlyChatDiv = document.createElement("div");';
    r += 'iFlyChatDiv.className = \'iflychat-popup\';';
    r += 'document.body.appendChild(iFlyChatDiv);';
    r += '</script>';

  }
  return r;
};

_iFlyNode.loadChatFile = function() {

  var r = '';
  r += '<script> var iflychat_auth_token = "' + _iFlyNode.token + '";</script>';
  r += '<script>var iFlyChatDiv2 = document.createElement("script");';
  r += 'iFlyChatDiv2.src = "//cdn.iflychat.com/js/iflychat-v2.min.js?app_id=' + _iFlyNode.settings.appId +'";';
  r += 'iFlyChatDiv2.async = true;';
  r += 'document.body.appendChild(iFlyChatDiv2);';
  r += '</script>';
  return r;


};


iFlyNode.setUser = function(user_details){

  if(!_.isEmpty(user_details.user_id) && typeof(user_details.user_id) === 'string') {
    _iFlyNode.userDetails.userId = user_details.user_id;
  }
  if(!_.isEmpty(user_details.user_name) && typeof(user_details.user_name) === 'string') {
    _iFlyNode.userDetails.userName = user_details.user_name;
  }

  if(_.has(user_details, 'is_admin') && typeof(user_details.is_admin) === 'boolean') {
    _iFlyNode.userDetails.isAdmin = user_details.is_admin;
  }else{
    delete _iFlyNode.userDetails.isAdmin;
  }

  if(_.has(user_details, 'is_mod') && typeof(user_details.is_mod) === 'boolean') {
    _iFlyNode.userDetails.isMod = user_details.is_mod;
  }else{
    delete _iFlyNode.userDetails.isMod;
  }

  if(!_.isEmpty(user_details.user_avatar_url) && typeof(user_details.user_avatar_url) === 'string') {
    _iFlyNode.userDetails.userAvatarUrl = user_details.user_avatar_url;
  }else{
    delete _iFlyNode.userDetails.userAvatarUrl;
  }

  if(!_.isEmpty(user_details.user_profile_url) && typeof(user_details.user_profile_url) === 'string') {
    _iFlyNode.userDetails.userProfileUrl = user_details.user_profile_url;
  }else{
    delete _iFlyNode.userDetails.userProfileUrl;
  }

  if(!_.isEmpty(user_details.user_roles) && typeof(user_details.user_roles) === 'object') {
    _iFlyNode.userDetails.userRoles = _.cloneDeep(user_details.user_roles);
  }else{
    _iFlyNode.userDetails.userRoles = {};
  }

  if(!_.isEmpty(user_details.user_site_roles) && typeof(user_details.user_site_roles) === 'object') {
    _iFlyNode.userDetails.userSiteRoles = _.cloneDeep(user_details.user_site_roles);
  }else{
    _iFlyNode.userDetails.userSiteRoles = {};
  }

  if(!_.isEmpty(user_details.user_groups) && typeof(user_details.user_groups) === 'object') {
    _iFlyNode.userDetails.userGroups = _.cloneDeep(user_details.user_groups);
  }else{
    _iFlyNode.userDetails.userGroups = {};
  }
 
  if(!_.isEmpty(user_details.user_relationships) && typeof(user_details.user_relationships) === 'object') {
    _iFlyNode.userDetails.userRelationships = _.cloneDeep(user_details.user_relationships);
  }else{
    _iFlyNode.userDetails.userRelationships = [];
  }
  
}


iFlyNode.setRelationship = function(relFlag){
  _iFlyNode.userDetails.relationshipsSet = relFlag;
}

iFlyNode.getHtmlCode = function(cb) {
  iFlyNode.getToken(function(err, res) {
    if(res) {
      _iFlyNode.returnToken(res);
      var loadChatFile = _iFlyNode.loadChatFile();
      var loadPopUp = _iFlyNode.loadPopUp();
      return cb(false, loadChatFile + loadPopUp);
    }
    else {
      return cb(true, false);
    }
  });
};

module.exports = iFlyNode;

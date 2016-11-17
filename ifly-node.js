var iFlyNode = {};
var _iFlyNode = {};


var request = require('request');
var _ = require('lodash');

_iFlyNode.settings = {};

_iFlyNode.settings.HOST = 'http://api.iflychat.com';
_iFlyNode.settings.A_HOST = 'https://api.iflychat.com';
_iFlyNode.settings.PORT = '80';
_iFlyNode.settings.A_PORT = '443';

_iFlyNode.userDetails = {};

iFlyNode.init = function(api_key, app_id, popup) {
  _iFlyNode.settings.apiKey = api_key;
  _iFlyNode.settings.appId = app_id;
  _iFlyNode.settings.popUp = popup;
};

_iFlyNode.returnToken = function(token) {
  _iFlyNode.token = token;
};

_iFlyNode.getToken = function(cb) {
  var data = {};
  data.api_key = _iFlyNode.settings.apiKey;
  data.app_id = _iFlyNode.settings.appId;
  data.user_name = _iFlyNode.userDetails.userName;
  data.user_id = _iFlyNode.userDetails.userId;
  if(_.has(_iFlyNode.userDetails,'isAdmin')) {
    data.user_roles = 'admin';
    data.user_site_roles = _iFlyNode.userDetails.allRoles;
  }
  else {
    data.user_roles = {};
    for(var i in _iFlyNode.userDetails.allRoles) {
      data.user_roles[i] = _iFlyNode.userDetails.allRoles[i];
    }
  }
  if(_.has(_iFlyNode.userDetails,'userAvatarUrl')) {
    data.user_avatar_url = _iFlyNode.userDetails.userAvatarUrl;
  }
  if(_.has(_iFlyNode.userDetails,'relationships_set')) {
    data.user_list_filter = 'friend';
    data.user_relationships = _iFlyNode.userDetails.relationships_set;
  }
  else {
    data.user_list_filter = 'all';
  }
  data.user_profile_url = _iFlyNode.userDetails.userProfileUrl;
  if(_.has(_iFlyNode.userDetails,'userGroups')) {
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
    var obj = JSON.parse(response.body);
    //console.log(response.body);
    //console.log(typeof(obj));
    //console.log(obj.key);
    //console.log(body);
    //console.log(error);
    if (!error && response.statusCode == 200) {
      cb(false, obj.key);
      //_iFlyNode.returnToken(obj.key);
      //console.log("1");
      //console.log(_iFlyNode.token);
      //var chatFile = _iFlyNode.loadChatFile();
      //var popUp = _iFlyNode.loadPopUp();
      //console.log(chatFile);
      //console.log(popUp);
      //return chatFile+popUp;
    }
    else {
      cb(true, false);
    }
  });

};

_iFlyNode.loadPopUp = function() {
  var r = '';
  //console.log(typeof(_iFlyNode.settings.popUp));
  if (_iFlyNode.settings.popUp === true) {
    //console.log("1");
    r += '<script>var iFlyChatDiv = document.createElement("div");';
    r += 'iFlyChatDiv.className = \'iflychat-popup\';';
    r += 'document.body.appendChild(iFlyChatDiv);';
    r += '</script>';

  }
  return r;
  //console.log("popup");
  //console.log(r);

};

_iFlyNode.loadChatFile = function() {

  var r = '';
  r += '<script> var iflychat_auth_token = "' + _iFlyNode.token + '";</script>';
  r += '<script>var iFlyChatDiv2 = document.createElement("script");';
  r += 'iFlyChatDiv2.src = "//cdn.iflychat.com/js/iflychat-v2.min.js?app_id=' + _iFlyNode.settings.appId +'";';
  r += 'iFlyChatDiv2.async = true;';
  r += 'document.body.appendChild(iFlyChatDiv2);';
  r += '</script>';
  //console.log("chatfile");
  //console.log(r);
  return r;


};

iFlyNode.getHtmlCode = function(user_details, cb) {
  var r1;
  var r2;
  //console.log("working");
  if(_.has(user_details,'user_id') && !_.isEmpty(user_details.user_id)) {
    _iFlyNode.userDetails.userId = user_details.user_id;
  }
  if(_.has(user_details,'user_name') && !_.isEmpty(user_details.user_name)) {
    _iFlyNode.userDetails.userName = user_details.user_name;
  }
  if(_.has(user_details,'is_admin') && !_.isEmpty(user_details.is_admin)) {
    _iFlyNode.userDetails.isAdmin = user_details.is_admin;
  }
  if(_.has(user_details,'user_avatar_url') && !_.isEmpty(user_details.user_avatar_url)) {
    _iFlyNode.userDetails.userAvatarUrl = user_details.user_avatar_url;
  }
  if(_.has(user_details,'user_profile_url') && !_.isEmpty(user_details.user_profile_url)) {
    _iFlyNode.userDetails.userProfileUrl = user_details.user_profile_url;
  }
  if(_.has(user_details,'user_roles') && !_.isEmpty(user_details.user_roles)) {
    _iFlyNode.userDetails.userRoles = user_details.user_roles;
  }
  if(_.has(user_details,'user_groups') && !_.isEmpty(user_details.user_groups)) {
    _iFlyNode.userDetails.userGroups = user_details.user_groups;
  }
  if(_.has(user_details,'user_relationships') && !_.isEmpty(user_details.user_relationships)) {
    _iFlyNode.userDetails.userRelationships = user_details.user_relationships;
  }
  _iFlyNode.getToken(function(err, res) {
    //console.log(res);
    //console.log(err);
    if(res) {
      //console.log("1");
      _iFlyNode.returnToken(res);
      var r1 = _iFlyNode.loadChatFile();
      var r2 = _iFlyNode.loadPopUp();
      cb(false, r1+r2);
      //console.log(r1+r2);
    }
    else {
      cb(true, false);
    }
  });
  //console.log("2");
  //return r1+r2;

};

module.exports = iFlyNode;

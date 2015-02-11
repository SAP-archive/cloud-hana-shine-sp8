$.import("{{PACKAGE_NAME}}.services", "messages");
var MESSAGES = $.{{PACKAGE_NAME}}.services.messages;
$.import("{{PACKAGE_NAME}}.services", "session");
var SESSION = $.{{PACKAGE_NAME}}.services.session;

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "setSession":
        var result = SESSION.set_session_variable('test', '{{PACKAGE_NAME}}.services.sessionTest', 'Session Test1');
        $.response.setBody(result.toString());
        $.response.status = $.net.http.OK;
        break;
    case "setApplication":
        var result = SESSION.set_application_variable('test', '{{PACKAGE_NAME}}.services.sessionTest', 'Application Test1');
        $.response.setBody(result.toString());
        $.response.status = $.net.http.OK;
        break;
    case "setTable":
        var conn = $.db.getConnection();
        var pstmt;
        var rs;
        var query = 'select USER_NAME, USER_MODE, CREATOR from users';
        pstmt = conn.prepareStatement(query);
        rs = pstmt.executeQuery();
        var jsonOut = SESSION.recordSetToJSON(rs, 'Tables');
        pstmt.close();
        conn.commit();
        conn.close();
        var result = SESSION.set_application_variable('tables', '{{PACKAGE_NAME}}.services.sessionTest', JSON.stringify(jsonOut));
        $.response.setBody(result.toString());
        $.response.status = $.net.http.OK;
        break;
    case "getSessionInfo":
        SESSION.fillSessionInfo();
        break;
    case "getSession":
        $.response.contentType = 'text/plain';
        var body = SESSION.get_session_variable('test', '{{PACKAGE_NAME}}.services.sessionTest');
        $.response.setBody(body);
        $.response.status = $.net.http.OK;
        break;
    case "getApplication":
        $.response.contentType = 'text/plain';
        var body = SESSION.get_application_variable('test', '{{PACKAGE_NAME}}.services.sessionTest');
        $.response.setBody(body);
        $.response.status = $.net.http.OK;
        break;
    case "getTable":
        $.response.contentType = 'application/json';
        var body = SESSION.get_application_variable('tables', '{{PACKAGE_NAME}}.services.sessionTest');
        $.response.setBody(body);
        $.response.status = $.net.http.OK;
        break;
    default:
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', encodeURI(aCmd)));
}
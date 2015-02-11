$.import("{{PACKAGE_NAME}}.services", "messages");
var MESSAGES = $.{{PACKAGE_NAME}}.services.messages;
$.import("{{PACKAGE_NAME}}.services", "session");
var SESSIONINFO = $.{{PACKAGE_NAME}}.services.session;

//Get Sales Orders filtered by the specified attribute value.
function getFilter() {
    function createFilterEntry(rs, attribute, obj) {
        return {
            "score": rs.getNString(1),
            "terms": rs.getNString(2),
            "attribute": attribute,
            "category": obj
        };
    }

    var body = '';
    var terms = $.request.parameters.get('query');
    var conn = $.db.getConnection();
    var pstmt;
    var rs;
    var query;
    var list = [];

    try {

        // Business Partner Company Name	
        query = 'SELECT TO_INT(SCORE()*100)/100 AS score, TO_NVARCHAR(COMPANYNAME) FROM "{{PACKAGE_NAME}}.data::EPM.MD.BusinessPartner" ' + ' WHERE CONTAINS(COMPANYNAME,?,FUZZY(0.7 , \'similarCalculationMode=symmetricsearch\')) ORDER BY score DESC';


        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '001'), "company"));
        }

        rs.close();
        pstmt.close();

        // Business Partner City
        query = 'SELECT TO_INT(SCORE()*100)/100 AS score, TO_NVARCHAR(CITY) FROM "{{PACKAGE_NAME}}.models::AT_BUYER" ' + ' WHERE CONTAINS("CITY",?,FUZZY( 0.7 , \'similarCalculationMode=symmetricsearch\')) ORDER BY score DESC';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '007'), "businessPartner"));
        }

        rs.close();
        pstmt.close();

        conn.close();
    } catch (e) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(e.message);
        return;
    }
    body = JSON.stringify(list);
    $.trace.debug(body);
    $.response.contentType = 'application/json';
    $.response.setBody(body);
    $.response.status = $.net.http.OK;
}


var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "filter":
        getFilter();
        break;
    case "getSessionInfo":
        SESSIONINFO.fillSessionInfo();
        break;
    default:
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', aCmd));
}
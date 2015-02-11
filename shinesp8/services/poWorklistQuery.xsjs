$.import("{{PACKAGE_NAME}}.services", "messages");
var MESSAGES = $.{{PACKAGE_NAME}}.services.messages;
$.import("{{PACKAGE_NAME}}.services", "session");
var SESSIONINFO = $.{{PACKAGE_NAME}}.services.session;

function getFilter() {
    function createFilterEntry(rs, attribute, obj) {
        return {
            "terms": rs.getNString(1),
            "attribute": attribute,
            "category": obj
        };
    }

    var body = '';
    var terms = $.request.parameters.get('query');
    var termList = terms.split(" ");
    var termStr = "";
    var i;
    for (i = 0; i < termList.length; i++) {
        termStr += termList[i].replace(/\s+/g, '') + "* ";
    }
    terms = termStr;

    var conn = $.db.getConnection();
    var pstmt;
    var rs;
    var query;
    var list = [];

    try {
        // Business Partner Company Name
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(COMPANYNAME) FROM "{{PACKAGE_NAME}}.data::EPM.MD.BusinessPartner" ' + ' WHERE CONTAINS(COMPANYNAME,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '001'), "businessPartner"));
        }

        rs.close();
        pstmt.close();

        // Business Partner City
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR("CITY") FROM "{{PACKAGE_NAME}}.models::AT_BUYER" ' + ' WHERE CONTAINS("CITY",?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '007'), "businessPartner"));
        }

        rs.close();
        pstmt.close();

        // Product - Product Category
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(CATEGORY) FROM "{{PACKAGE_NAME}}.data::EPM.MD.Products" ' + 'WHERE CONTAINS(CATEGORY,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '008'), "products"));
        }

        rs.close();
        pstmt.close();

        // Product - Product ID
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(PRODUCTID) FROM "{{PACKAGE_NAME}}.data::EPM.MD.Products" ' + 'WHERE CONTAINS(PRODUCTID,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '009'), "products"));
        }

        rs.close();
        pstmt.close();

        // Product - Product Name
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR("PRODUCT_NAME") FROM "{{PACKAGE_NAME}}.models::AT_PROD" ' + 'WHERE CONTAINS("PRODUCT_NAME",?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '010'), "products"));
        }

        rs.close();
        pstmt.close();

        // Product - Product Desc
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR("PRODUCT_DESCRIPTION") FROM "{{PACKAGE_NAME}}.models::AT_PROD" ' + 'WHERE CONTAINS("PRODUCT_DESCRIPTION",?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '011'), "products"));
        }

        // PO - PO ID
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(PURCHASEORDERID) FROM "{{PACKAGE_NAME}}.data::EPM.PO.Header" ' + 'WHERE CONTAINS(PURCHASEORDERID,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '002'), "purchaseOrder"));
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

function getTotalOrders() {
    function createTotalEntry(rs) {
        return {
            "name": rs.getNString(1),
            "value": rs.getDecimal(2)
        };
    }

    var body = '';
    var ivGroupBy = $.request.parameters.get('groupby');
    var ivCurrency = $.request.parameters.get('currency');
    var list = [];

    switch (ivGroupBy) {
        case "PARTNERCOMPANYNAME":
            break;
        case "PRODUCTCATEGORY":
            break;
        case "PARTNERCITY":
            break;
        case "PARTNERPOSTALCODE":
            break;
        case "PRODUCTID":
            break;

        default:
            $.response.status = $.net.http.BAD_REQUEST;
            $.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '000', ivGroupBy));
            return;

    }
    if (ivCurrency === null) {
        ivCurrency = "USD";
    }
    ivCurrency = ivCurrency.substring(0, 3);


    var CheckUpperCase = new RegExp('[A-Z]{3}');

    if (CheckUpperCase.test(ivCurrency) === true) {
        try {
            // not able to add Currency as prepared statement using setString so adding it in query directly
            var query = 'SELECT top 5 ' + ivGroupBy + ', SUM("CONVGROSSAMOUNT") FROM "{{PACKAGE_NAME}}.models::AN_PURCHASE_COMMON_CURRENCY"' + ' (\'PLACEHOLDER\' = (\'$$IP_O_TARGET_CURRENCY$$\', \'' + ivCurrency + '\')) group by ' + ivGroupBy + ' order by sum("CONVGROSSAMOUNT") desc';
            $.trace.debug(query);
            var conn = $.db.getConnection();
            var pstmt = conn.prepareStatement(query);
            var rs = pstmt.executeQuery();

            while (rs.next()) {
                list.push(createTotalEntry(rs));
            }

            rs.close();
            pstmt.close();
        } catch (e) {
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
            $.response.setBody(e.message);
            return;
        }

        body = JSON.stringify({
            "entries": list
        });

        $.response.contentType = 'application/json; charset=UTF-8';
        $.response.setBody(body);
        $.response.status = $.net.http.OK;

    } else {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody(MESSAGES.getMessage('SEPM_BOR_MESSAGES', '053', encodeURI(ivCurrency)));
        return;
    }
}

function downloadExcel() {
    var body = '';

    try {
        var query = 'SELECT TOP 25000 "PurchaseOrderId", "PartnerId", "CompanyName", "CreatedByLoginName", "History.CREATEDAT", "GrossAmount" ' + 'FROM "{{PACKAGE_NAME}}.data::purchaseOrderHeaderExternal" order by "PurchaseOrderId"';

        $.trace.debug(query);
        var conn = $.db.getConnection();
        var pstmt = conn.prepareStatement(query);
        var rs = pstmt.executeQuery();

        body = MESSAGES.getMessage('SEPM_POWRK', '002') + "\t" + // Purchase
        // Order ID
        MESSAGES.getMessage('SEPM_POWRK', '003') + "\t" + // Partner ID
        MESSAGES.getMessage('SEPM_POWRK', '001') + "\t" + // Company Name
        MESSAGES.getMessage('SEPM_POWRK', '004') + "\t" + // Employee
        // Responsible
        MESSAGES.getMessage('SEPM_POWRK', '005') + "\t" + // Created At
        MESSAGES.getMessage('SEPM_POWRK', '006') + "\n"; // Gross Amount

        while (rs.next()) {
            body += rs.getNString(1) + "\t" + rs.getNString(2) + "\t" + rs.getNString(3) + "\t" + rs.getNString(4) + "\t" + rs.getDate(5) + "\t" + rs.getDecimal(6) + "\n";
        }
    } catch (e) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(e.message);
        return;
    }

    $.response.setBody(body);
    $.response.contentType = 'application/vnd.ms-excel; charset=utf-16le';
    $.response.headers.set('Content-Disposition',
        'attachment; filename=Excel.xls');
    $.response.status = $.net.http.OK;

}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "filter":
        getFilter();
        break;
    case "getTotalOrders":
        getTotalOrders();
        break;
    case "Excel":
        downloadExcel();
        break;
    case "getSessionInfo":
        SESSIONINFO.fillSessionInfo();
        break;
    default:
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', aCmd));
}
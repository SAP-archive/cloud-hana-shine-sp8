function getData() {
    // encodeURI to avoud injection attacks
    var bpId = encodeURI($.request.parameters.get('bpId'));
    var output = {};
    var entry;
    var conn = $.db.getConnection();
    // get total sales amount
    var pstmt = conn.prepareStatement(
        'select sum(GROSSAMOUNT) as AMOUNT from ' + '"_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.SO.Header" ' + 'where "PARTNERID.PARTNERID" = ?');
    pstmt.setString(1, bpId);
    var rs = pstmt.executeQuery();

    if (!rs.next()) {
        $.response.setBody("Failed to retieve data");
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    } else {
        output.salesTotal = rs.getString(1);
    }

    rs.close();
    pstmt.close();

    // get total sales amount per year
    if (output.salesTotal !== null) {
        pstmt = conn.prepareStatement(
            'select sum(GROSSAMOUNT) as AMOUNT, YEAR("HISTORY.CREATEDAT") from ' + '"_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.SO.Header" ' + 'where "PARTNERID.PARTNERID" = ? group by ' + 'YEAR("HISTORY.CREATEDAT") order by YEAR("HISTORY.CREATEDAT")');
        pstmt.setString(1, bpId);
        rs = pstmt.executeQuery();

        if (!rs.next()) {
            $.response.setBody("Failed to retieve data");
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        } else {

            output.salesYoY = [];

            do {
                entry = {};
                entry.amount = rs.getString(1);
                entry.year = rs.getString(2);
                entry.currency = 'EUR';
                output.salesYoY.push(entry);
            } while (rs.next());
        }

        rs.close();
        pstmt.close();
    }

    // total purchase amount
    pstmt = conn.prepareStatement(
        'select sum(GROSSAMOUNT) as AMOUNT from "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.PO.Header" ' + 'where "PARTNERID.PARTNERID" = ?');
    pstmt.setString(1, bpId);
    rs = pstmt.executeQuery();

    if (!rs.next()) {
        $.response.setBody("Failed to retieve data");
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    } else {
        output.purchaseTotal = rs.getString(1);
    }

    output.currency = 'EUR';

    rs.close();
    pstmt.close();

    // total purchase amount per year
    if (output.purchaseTotal !== null) {
        pstmt = conn.prepareStatement(
            'select sum(GROSSAMOUNT) as AMOUNT, YEAR("HISTORY.CREATEDAT") from ' + '"_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.PO.Header" ' + 'where "PARTNERID.PARTNERID" = ? group by YEAR("HISTORY.CREATEDAT") ' + 'order by YEAR("HISTORY.CREATEDAT")');
        pstmt.setString(1, bpId);
        rs = pstmt.executeQuery();

        if (!rs.next()) {
            $.response.setBody("Failed to retieve data");
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        } else {

            output.purchaseYoY = [];

            do {
                entry = {};
                entry.amount = rs.getString(1);
                entry.year = rs.getString(2);
                entry.currency = 'EUR';
                output.purchaseYoY.push(entry);
            } while (rs.next());
        }

        rs.close();
        pstmt.close();
    }

    conn.close();

    $.response.setBody(JSON.stringify(output));
    $.response.contentType = "application/json";
    $.response.status = $.net.http.OK;
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "getData":
        getData();
        break;
    default:
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody('Invalid Command: ' + aCmd);
}
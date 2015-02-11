//Get all the Business Partners into an array
function getBuinessPartners() {
    var bpDict = [];

    var conn = $.db.getConnection();
    var query = "SELECT \"PARTNERID\" FROM \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.MD.BusinessPartner\"";
    var pstmt = conn.prepareStatement(query);
    var rsBP = pstmt.executeQuery();
    while (rsBP.next()) {
        bpDict.push(rsBP.getNString(1));
    }
    rsBP.close();
    pstmt.close();
    conn.close();

    return bpDict;
}
//Get all Products into an array
function getProducts() {
    var prodDict = [];

    var conn = $.db.getConnection();

    // Select ProductId and the corresponding Price
    var query = "SELECT \"PRODUCTID\", \"PRICE\" FROM \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.MD.Products\"";
    var pstmt = conn.prepareStatement(query);
    var rs = pstmt.executeQuery();
    while (rs.next()) {
        prodDict.push({
            prod: rs.getNString(1),
            price: rs.getDecimal(2)
        });
    }
    rs.close();
    pstmt.close();
    conn.close();
    return prodDict;
}

//Reset the sequence of the specified table
function resetTableSequence(object) {
    var selectQuery = '';
    var altQuery = '';
    var pstmt;
    var rs;
    var maxId = -1;
    switch (object) {
        case "addressSeqId":
            selectQuery = 'SELECT to_int(MAX("ADDRESSID") + 1) FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.MD.Addresses"';
            altQuery = 'ALTER SEQUENCE "_SYS_BIC"."{{PACKAGE_NAME}}.data::addressSeqId" RESTART WITH ';
            break;
        case "employeeSeqId":
            selectQuery = 'SELECT to_int(MAX("EMPLOYEEID") + 1) FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.MD.Employees"';
            altQuery = 'ALTER SEQUENCE "_SYS_BIC"."{{PACKAGE_NAME}}.data::employeeSeqId" RESTART WITH ';
            break;
        case "partnerSeqId":
            selectQuery = 'SELECT to_int(MAX("PARTNERID") + 1) FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.MD.BusinessPartner"';
            altQuery = 'ALTER SEQUENCE "_SYS_BIC"."{{PACKAGE_NAME}}.data::partnerSeqId" RESTART WITH ';
            break;
        case "purchaseOrderSeqId":
            selectQuery = 'SELECT to_int(MAX("PURCHASEORDERID") + 1) FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.PO.Header"';
            altQuery = 'ALTER SEQUENCE "_SYS_BIC"."{{PACKAGE_NAME}}.data::purchaseOrderSeqId" RESTART WITH ';
            break;
        case "salesOrderId":
            selectQuery = 'SELECT to_int(MAX("SALESORDERID") + 1) FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.SO.Header"';
            altQuery = 'ALTER SEQUENCE "_SYS_BIC"."{{PACKAGE_NAME}}.data::salesOrderId" RESTART WITH ';
            break;
        case "textSeqId":
            selectQuery = 'SELECT to_int(MAX("TEXTID") + 1) FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Util.Texts"';
            altQuery = 'ALTER SEQUENCE "_SYS_BIC"."{{PACKAGE_NAME}}.data::textSeqId" RESTART WITH ';
            break;
        default:
            return maxId;
    }
    // open db connection needed for repository sessions
    var conn = $.db.getConnection(8);
    pstmt = conn.prepareStatement(selectQuery);
    rs = pstmt.executeQuery();
    while (rs.next()) {
        maxId = rs.getNString(1);
    }
    rs.close();
    pstmt.close();
    if (maxId !== null && maxId !== -1) {
        pstmt = conn.prepareStatement(altQuery + maxId);
        pstmt.executeUpdate();
        pstmt.close();
    }
    //	End of code based on new logic
    conn.commit();
    conn.close();

    return maxId;

}
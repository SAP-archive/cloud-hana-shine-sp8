try {

    var requestBody = $.request.body.asString();

    var polygon = JSON.parse(requestBody);
    var i = 0;
    // create polygon search string
    var polygonString = 'NEW ST_Point(LATITUDE, LONGITUDE).ST_Within( NEW ST_Polygon(\'Polygon((';
    for (i; i < polygon.points.length; i++) {
        polygonString += polygon.points[i].lat + ' ' + polygon.points[i].long;
        if (i !== polygon.points.length - 1) {
            polygonString += ',';
        }
    }
    polygonString += "))'))";

    var conn = $.db.getConnection();
    var pstmt;
    var rs;
    var cond;
    var entry;
    var body = {};

    // get the total sales amount for the region
    // make sure the polygon is complete i.e. first and last point are same
    pstmt = conn.prepareStatement('select SUM(GROSSAMOUNT),' + polygonString + ' from "_SYS_BIC"."{{PACKAGE_NAME}}.spatial.models/REGION_SALES_BP" group by ' + polygonString);
    rs = pstmt.executeQuery();

    var totalSalesAmount = '';

    while (rs.next()) {
        cond = parseInt(rs.getString(2), 10);
        if (cond === 1) {
            body.totalSales = rs.getString(1);
        }
    }
    rs.close();
    pstmt.close();

    body.topBuyers = [];

    // get the top 5 buyers 
    // make sure the polygon is complete i.e. first and last point are same
    pstmt = conn.prepareStatement('select PARTNERID,COMPANYNAME,LEGALFORM,LATITUDE,LONGITUDE,SUM(GROSSAMOUNT),' + polygonString + ' from "_SYS_BIC"."{{PACKAGE_NAME}}.spatial.models/REGION_SALES_BP" group by PARTNERID,COMPANYNAME,LEGALFORM,LATITUDE,LONGITUDE,' + polygonString + ' order by SUM(GROSSAMOUNT) desc');
    rs = pstmt.executeQuery();

    var count = 0;
    while (rs.next()) {
        cond = parseInt(rs.getString(7), 10);
        if (cond === 1) {
            count++;
            entry = {};
            entry.partnerID = rs.getString(1);
            entry.companyName = rs.getString(2);
            entry.legalForm = rs.getString(3);
            entry.totalSales = rs.getString(6);
            entry.lat = rs.getString(4);
            entry.long = rs.getString(5);
            body.topBuyers.push(entry);
        }
        if (count >= 5) {
            break;
        }
    }
    rs.close();
    pstmt.close();

    // get the sales amount year over year
    // make sure the polygon is complete i.e. first and last point are same
    pstmt = conn.prepareStatement('select YEAR_OF_SALE,SUM(GROSSAMOUNT),' + polygonString + 'from "_SYS_BIC"."{{PACKAGE_NAME}}.spatial.models/REGION_SALES_BP" group by YEAR_OF_SALE,' + polygonString + ' order by YEAR_OF_SALE');
    rs = pstmt.executeQuery();

    body.salesYoY = [];

    while (rs.next()) {
        cond = parseInt(rs.getString(3), 10);
        if (cond === 1) {
            entry = {};
            entry.year = rs.getString(1);
            entry.salesAmount = rs.getString(2);
            body.salesYoY.push(entry);
        }
    }
    rs.close();
    pstmt.close();

    $.response.contentType = 'application/json';
    $.response.setBody(JSON.stringify(body));
    $.response.status = $.net.http.OK;

    conn.close();

} catch (e) {
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody(e.message);
}
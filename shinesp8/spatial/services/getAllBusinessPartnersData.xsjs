$.response.contentType = "application/json";
var output = {
    entry: []
};

var conn = $.db.getConnection();
conn.prepareStatement("SET SCHEMA \"_SYS_BIC\"").execute(); 
// get data from BP_ADDRESS_DETAILS.attributeview
// model location : SHINE/spatial/models
var pstmt = conn.prepareStatement(
    'select PARTNERID,EMAILADDRESS,PHONENUMBER,WEBADDRESS,COMPANYNAME,LEGALFORM,' 
		+ 'BUILDING,STREET,CITY,POSTALCODE,COUNTRY,REGION,LATITUDE,LONGITUDE FROM ' 
		+ '"_SYS_BIC"."{{PACKAGE_NAME}}.spatial.models/BP_ADDRESS_DETAILS"');
var rs = pstmt.executeQuery();
var bpEntry = {};
if (!rs.next()) {
    $.response.setBody("Failed to retieve data");
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
} else {
    do {
        bpEntry = {};
        bpEntry.ID = rs.getString(1);
        bpEntry.Name = rs.getString(5) + ' ' + rs.getString(6);
        bpEntry.Street = rs.getString(8);
        bpEntry.Building = rs.getString(7);
        bpEntry.Zip = rs.getString(10);
        bpEntry.City = rs.getString(9);
        bpEntry.Country = rs.getString(11);
        bpEntry.Email = rs.getString(2);
        bpEntry.Phone = rs.getString(3);
        bpEntry.Web = rs.getString(4);
        bpEntry.Region = rs.getString(12);
        bpEntry.lat = rs.getString(13);
        bpEntry.long = rs.getString(14);


        output.entry.push(bpEntry);
    } while (rs.next());

    $.response.setBody(JSON.stringify(output));
    $.response.status = $.net.http.OK;
}

rs.close();
pstmt.close();
conn.close();
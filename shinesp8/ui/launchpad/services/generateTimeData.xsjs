$.response.contentType = "application/json";
var output = {
    entry: {}
};

var conn = $.db.getConnection();
// get keys from MapKeys table
var pstmt = conn.prepareStatement('MDX UPDATE TIME DIMENSION Day 2012 2015');
var rs = pstmt.executeQuery();

$.response.status = $.net.http.OK;

rs.close();
pstmt.close();
conn.close();
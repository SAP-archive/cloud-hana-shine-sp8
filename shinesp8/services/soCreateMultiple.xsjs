/* Create Sales Order with multiple line items*/
var body = $.request.body.asString();

var overallsoData = JSON.parse(body);

var responseBody = '';
var so_items;
var gross_amt = 0;
var prod_price = 0;
var lv_productid;
var lv_price;
var lv_quantity;
var lv_netamount;
var lv_taxamount;
var lv_grossamount;
var item_id = 10;
var lv_so_netamount = 0;
var lv_so_grossamount = 0;
var lv_so_taxamount = 0;
var i = 0;
var lv_bp_id;
var lv_company;
var lv_table;
var lv_tax = 0;
var result;
var rs, pstmt, pc;

responseBody += 'BP_ID:' + encodeURI(overallsoData.PARTNERID) + "\n";

var conn = $.db.getConnection();
conn.prepareStatement("SET SCHEMA \"_SYS_BIC\"").execute();

pstmt = conn.prepareStatement('SELECT \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::salesOrderId\".NEXTVAL as OverallId from Dummy');


rs = pstmt.executeQuery();
var overAllId = '';

if (rs.next()) {
    overAllId = rs.getNString(1);
    responseBody += 'so id ' + overAllId + '\n';
}

rs.close();
pstmt.close();


//Get the company name for the BP id and store it in a local variable
lv_bp_id = encodeURI(overallsoData.PARTNERID);
//use prepared statement to avoid sql injection attacks
pstmt = conn.prepareStatement('SELECT COMPANYNAME from "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.MD.BusinessPartner" where PARTNERID = ?');
pstmt.setString(1, lv_bp_id);
rs = pstmt.executeQuery();

if (rs.next()) {
    lv_company = rs.getNString(1);
    responseBody += 'lv_company ' + lv_company + '\n';
}

rs.close();
pstmt.close();



so_items = overallsoData.SalesOrderItems;


//Insert all Sales Order Items
if (so_items) {

    for (i; i < so_items.length; i++) {
        responseBody += 'item' + i + ' ' + 'Product_Id:' + so_items[i].Product_Id;
        responseBody += 'item' + i + ' ' + 'Quantity:' + so_items[i].Quantity;

        lv_productid = encodeURI(so_items[i].Product_Id);
        lv_quantity = encodeURI(so_items[i].Quantity);
        // Get price of the product from Product table
        pstmt = conn.prepareStatement('SELECT PRICE from "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.MD.Products" where PRODUCTID = ?');
        pstmt.setString(1, lv_productid);
        rs = pstmt.executeQuery();

        if (rs.next()) {
            lv_price = rs.getNString(1);
            responseBody += 'lv_price ' + lv_price + '\n';
        }

        rs.close();
        pstmt.close();

        // default tax rate
        lv_tax = 1.9;

        lv_netamount = lv_price * lv_quantity;
        //Get the tax amount based on the tax code
        lv_taxamount = lv_netamount * lv_tax;
        lv_grossamount = lv_netamount + lv_taxamount;
        //Insert Item into table
        pstmt = conn.prepareStatement('insert into "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.SO.Item"' + " values(?,?,?,'','EUR',?,?,?,'I','',?,'EA','')");
        pstmt.setString(1, '0' + overAllId);
        if (item_id >= 100) {
            pstmt.setString(2, '0000000' + item_id);
        } else {
            pstmt.setString(2, '00000000' + item_id);
        }
        pstmt.setString(3, lv_productid);
        pstmt.setDouble(4, lv_grossamount);
        pstmt.setDouble(5, lv_netamount);
        pstmt.setDouble(6, lv_taxamount);
        pstmt.setString(7, lv_quantity);

        rs = pstmt.execute();
        pstmt.close();

        item_id = item_id + 10;

        //Calculate the total of net amount, gross amount and tax amount for all line items
        lv_so_netamount = lv_so_netamount + lv_netamount;
        lv_so_grossamount = lv_so_grossamount + lv_grossamount;
        lv_so_taxamount = lv_so_taxamount + lv_taxamount;

    }

}

//Insert Sales Order Header
pstmt = conn.prepareStatement('insert into \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.SO.Header\"' + " values(?,'0000000033',CURRENT_DATE,'0000000033',CURRENT_DATE,''," + "?,'EUR',?,?,?,'N','I','I')");
pstmt.setString(1, '0' + overAllId);
pstmt.setString(2, overallsoData.PARTNERID);
pstmt.setDouble(3, lv_so_grossamount);
pstmt.setDouble(4, lv_so_netamount);
pstmt.setDouble(5, lv_so_taxamount);

rs = pstmt.execute();

pstmt.close();

conn.commit();
conn.close();

$.response.status = $.net.http.CREATED;
$.response.setBody(responseBody);
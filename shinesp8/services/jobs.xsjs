//Inserts timestamp into the 'JobsDemo' table.
function createEntry() {
    var conn = $.db.getConnection();
    var pStmt;
    pStmt = conn.prepareStatement('insert into "{{PACKAGE_NAME}}.data::JobsDemo.Details"(TIME,SOURCE) values (now(), ' +
        "'Inserted via XSJS'" + ')');
    pStmt.executeUpdate();
    pStmt.close();
    conn.commit();
    conn.close();

}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "Create":
        createEntry();
        break;
    default:
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Invalid Command');
}
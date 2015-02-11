set schema "_SYS_BIC";
drop trigger "{{PACKAGE_NAME}}.functions/add_insert_to_log";
CREATE TRIGGER "{{PACKAGE_NAME}}.functions/add_insert_to_log"
    AFTER INSERT ON 
         "{{PACKAGE_NAME}}.data::EPM.MD.Products" 
    REFERENCING NEW ROW newrow FOR EACH ROW
 BEGIN

  INSERT INTO "{{PACKAGE_NAME}}.data::EPM.MD.productLog" 
           VALUES(:newrow.PRODUCTID, 
                  now(), 
                  CURRENT_USER,
                  :newrow.PRODUCTID || ' has been created');
 END;
 
 INSERT into "{{PACKAGE_NAME}}.data::EPM.MD.Products" 
          values( 'ProductA', 'PR', 'Handheld', '0000000033', '20121003', '0000000033', '20121003',
                  '1000000149', '1000000150', '0100000029', 1, 'EA', 0.5, 'KG', 'CAD', 2490, '/sap/hana/democontent/epm/data/images/HT-7030.jpg',
                  0.09, 0.15, 0.1, 'M');

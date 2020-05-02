/*
[Date]:     02.03.2020
[Point]:    Add: 
            - "device-controller" relation expire trigger on "DevieControllers" table
*/

CREATE OR REPLACE FUNCTION expire_device_controller_relation() RETURNS TRIGGER AS
$BODY$
BEGIN
  DELETE FROM "DeviceControllers" WHERE "createdAt" < now() - INTERVAL '2 hours'; --Session max age

  RETURN NEW;
END
$BODY$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_device_controller ON "DeviceControllers";

CREATE TRIGGER trg_device_controller AFTER INSERT ON "DeviceControllers" 
  EXECUTE PROCEDURE expire_device_controller_relation();